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
    constructor(
        private productImeiService: ProductImeiService,
        private addressService: AddressService,
        private formBuilder: FormBuilder,
        private warrantyService: WarrantyService,
        private http: HttpClient,
        private router: Router
    ) {
        this.phoneNumberForm = this.formBuilder.group({
            phoneNumber: ['', [Validators.required, Validators.pattern('^\\d{10}$')]]
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

}
