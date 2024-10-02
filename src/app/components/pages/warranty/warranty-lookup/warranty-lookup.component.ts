import { AddressService } from 'src/app/core/services/address.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarrantyService } from 'src/app/core/services/warranty.service';
import { Router } from '@angular/router';
import { ProductImeiService } from 'src/app/core/services/product-imei.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'app-warranty-lookup',
  templateUrl: './warranty-lookup.component.html',
  styleUrl: './warranty-lookup.component.scss'
})
export class WarrantyLookupComponent implements OnInit {
  phoneNumberForm: FormGroup;
  customer: any = null;
  warrantyProducts: any[] = [];
  public url = environment.url;
  warrantyData: any[] = [];
  isChecked: boolean = false;
  showErrors = false;

  constructor(
    private productImeiService: ProductImeiService,
    private addressService: AddressService,
    private formBuilder: FormBuilder,
    private warrantyService: WarrantyService,
    private http: HttpClient,
    private router: Router
  ) {
    this.phoneNumberForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]],
      inputData: ['']
    });
  }
  ngOnInit() {
  }

  checkWarranty() {
    const phoneNumber = this.phoneNumberForm.get('phoneNumber')?.value;
    const apiUrl = `${this.url}/api/warranty/paging?PhoneNumber=${phoneNumber}`;

    this.http.get(apiUrl).subscribe((response: any) => {
      if (response?.data?.items?.length) {
        const warrantyData = response.data.items[0];
        this.customer = warrantyData.customer; // Assign customer data
        this.warrantyProducts = warrantyData.warrantyProducts; // Assign warranty products data
      } else {
        this.customer = null;
        this.warrantyProducts = [];
      }
    }, error => {
      console.error('Error fetching data:', error);
      this.customer = null;
      this.warrantyProducts = [];
    });
  }


  checkWarranty2() {
    const inputData = this.phoneNumberForm.get('inputData')?.value;

    const phoneRegex = /^[0-9]{10,11}$/;
    const engineFrameRegex = /^([A-Z0-9]+)-([A-Z0-9]+)$/;  // Thay đổi gạch ngang

    if (phoneRegex.test(inputData)) {
      this.showErrors = false;
      const apiUrl = `${this.url}/api/warranty/paging?PhoneNumber=${inputData}`;

      this.callWarrantyApi(apiUrl);
    } else if (engineFrameRegex.test(inputData)) {
      this.showErrors = false;
      const match = inputData.match(engineFrameRegex);
      const frameNumber = match[1];
      const engineNumber = match[2];

      const apiUrl = `${this.url}/api/warranty/paging?FrameNumber=${frameNumber}&EngineNumber=${engineNumber}`;

      this.callWarrantyApi(apiUrl);
    } else {
      this.showErrors = true;
    }
  }

  removeWhitespace() {
    const inputControl = this.phoneNumberForm.get('inputData');
    if (inputControl) {
      // Loại bỏ tất cả khoảng trắng trong giá trị nhập vào
      const sanitizedValue = inputControl.value.replace(/\s+/g, '');
      inputControl.setValue(sanitizedValue, { emitEvent: false });
    }
  }

  callWarrantyApi(apiUrl: string) {
    this.http.get(apiUrl).subscribe(
      (response: any) => {
        const data = response.data.items;

        // Gán trạng thái đã kiểm tra
        this.isChecked = true;

        if (data.length === 0) {
          console.log("Không tìm thấy thông tin bảo hành!");
          this.customer = null;
          this.warrantyData = [];
          return;
        }

        // Gán thông tin khách hàng
        this.customer = data[0].customer;

        // Gán thông tin bảo hành
        this.warrantyData = data.map((item: any) => item.warrantyProducts).flat();
        console.log("Thông tin bảo hành:", this.warrantyData);
      },
      (error) => {
        this.isChecked = true; // Gán trạng thái đã kiểm tra ngay cả khi lỗi
        console.error("Đã xảy ra lỗi khi kiểm tra thông tin bảo hành", error);
      }
    );
  }

}
