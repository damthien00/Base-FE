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
    
      if (!inputData) {
        console.log("Vui lòng nhập số điện thoại hoặc số máy!");
        return;
      }
    
      const isPhoneNumber = /^[0-9]+$/.test(inputData);
      let apiUrl = '';
    
      if (isPhoneNumber) {
        apiUrl = `${this.url}/api/warranty/paging?PhoneNumber=${inputData}`;
      } else {
        apiUrl = `${this.url}/api/warranty/paging?EngineNumber=${inputData}`;
      }
    
      this.http.get(apiUrl).subscribe(
        (response: any) => {
          const data = response.data.items;

          // Gán trạng thái đã kiểm tra
          this.isChecked = true;

    
          if (data.length === 0) {
            console.log("Không tìm thấy thông tin bảo hành!");
            this.customer = null;
            this.warrantyData = []; // Không có dữ liệu bảo hành
            return;
          }

          this.customer = data[0].customer;
    
          const filteredData = data.filter((item: any) =>
            isPhoneNumber
              ? item.phoneNumber === inputData
              : (item.warrantyProducts && item.warrantyProducts.some((wp: any) => wp.inventoryStockDetailProductImei?.engineNumber === inputData))
          );
    
          if (filteredData.length > 0) {
            this.warrantyData = filteredData.map((item: any) => item.warrantyProducts).flat();
            console.log("Thông tin bảo hành:", this.warrantyData);
          } else {
            this.warrantyData = []; // Không tìm thấy dữ liệu phù hợp
            console.log("Không tìm thấy thông tin khớp với số điện thoại hoặc số máy.");
          }
        },
        (error) => {
          this.isChecked = true;
          console.error("Đã xảy ra lỗi khi kiểm tra thông tin bảo hành", error);
        }
      );
    }
    
      

}