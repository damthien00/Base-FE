import { AddressService } from 'src/app/core/services/address.service';
import { ProductImeiService } from './../../core/services/product-imei.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarrantyService } from 'src/app/core/services/warranty.service';
import { Router } from '@angular/router';
interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}
@Component({
    selector: 'app-activate-warranty',
    templateUrl: './activate-warranty.component.html',
    styleUrls: ['./activate-warranty.component.css'],
})
export class ActivateWarrantyComponent implements OnInit {
    countries: any[] | undefined;
    filteredCountries: any[] | undefined;
    createActivateWarranty: FormGroup;
    constructor(
        private productImeiService: ProductImeiService,
        private addressService: AddressService,
        private formBuilder: FormBuilder,
        private warrantyService: WarrantyService,
        private router: Router
    ) {
        this.createActivateWarranty = this.formBuilder.group({
            phoneNumber: [null, [Validators.required]],
            customerName: [null, [Validators.required]],
            cityId: [null],
            districtId: [null],
            wardId: [null],
            address: [null],
        });
    }
    products!: any[];
    keywords: any;
    cities: any;
    districts: any;
    wards: any;
    selectedCountryId!: number;
    selectedCityId!: number;
    selectedDistrictId!: number;
    selectedWardId!: number;
    ngOnInit() {
        this.getCitiesByCountry(1);
    }

    productListSelected: any[] = [];

    filterCountry(event: AutoCompleteCompleteEvent) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (this.countries as any[]).length; i++) {
            let country = (this.countries as any[])[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredCountries = filtered;
    }

    onSearchProductEmei() {
        if (this.keywords) {
            const keywordsArray = this.keywords.split('-');
            const FrameNumber = keywordsArray[0]?.trim();
            const EngineNumber = keywordsArray[1]?.trim();

            if (FrameNumber && EngineNumber) {
                this.productImeiService
                    .getProoductByEmei(FrameNumber, EngineNumber)
                    .subscribe(
                        (data) => {
                            const product = data?.data;
                            console.log(product);

                            if (product) {
                                const isProductExists =
                                    this.productListSelected.some(
                                        (p) => p.id === product.id // So sánh theo ID hoặc một thuộc tính duy nhất của sản phẩm
                                    );

                                if (!isProductExists) {
                                    this.productListSelected.push(product);
                                } else {
                                    console.log(
                                        'Product already exists in the list'
                                    );
                                }
                            } else {
                                console.error('No product found');
                            }
                        },
                        (error) => {
                            console.error('Error fetching product:', error);
                        }
                    );
            } else {
                console.error(
                    'Invalid input format. Please provide FrameNumber-EngineNumber'
                );
            }
        } else {
            console.error('Keywords cannot be empty');
        }
    }

    getCitiesByCountry(countryId: number) {
        this.addressService
            .getCitiesByIdCountry(countryId)
            .subscribe((cities) => {
                console.log(cities.data);
                this.cities = cities.data;
            });

        console.log(countryId);
    }

    getDistrictsByCity(cityId: number) {
        this.addressService
            .getDistrictsByIdCity(cityId)
            .subscribe((districts) => {
                console.log(districts.data);
                this.districts = districts.data;
            });
    }

    getWardsByDistrict(districtId: number) {
        this.addressService
            .getWardsByIdDistrict(districtId)
            .subscribe((wards) => {
                this.wards = wards.data;
            });
    }

    onCountryChange(countryId: number) {
        this.selectedCountryId = countryId;
        this.getCitiesByCountry(countryId);
        this.districts = [];
        this.wards = [];
    }

    onCityChange(event: any, cityId: number) {
        this.selectedCityId = event.value.id;
        this.getDistrictsByCity(event.value.id);
        this.districts = [];
        this.wards = [];
        this.createActivateWarranty.get('wardId')?.setValue(null);
        this.createActivateWarranty.get('districtId')?.setValue(null);
    }

    onDistrictChange(event: any, districtId: number) {
        console.log(event);
        this.selectedDistrictId = event.value.id;
        this.getWardsByDistrict(event.value.id);
        this.wards = [];
        this.createActivateWarranty.get('wardId')?.setValue(null);
    }

    onClearCity() {
        this.createActivateWarranty.get('wardId')?.setValue(null);
        this.createActivateWarranty.get('districtId')?.setValue(null);
    }

    onClearDistrict() {
        this.createActivateWarranty.get('wardId')?.setValue(null);
    }

    onClearWard() {
        this.createActivateWarranty.get('wardId')?.setValue(null);
    }
    onSubmit() {
        if (this.createActivateWarranty.valid) {
            console.log(this.createActivateWarranty.value);
            console.log(this.productListSelected);
            const formData = {
                code: 'string', // Bạn có thể thay thế giá trị này từ form nếu cần
                customerName:
                    this.createActivateWarranty.value.customerName || 'string',
                phoneNumber:
                    this.createActivateWarranty.value.phoneNumber || 'string',
                wardName: this.createActivateWarranty.value.wardId.name || 0,
                districtName:
                    this.createActivateWarranty.value.districtId.name || 0,
                cityName: this.createActivateWarranty.value.cityId.name || 0,
                customer: {
                    name:
                        this.createActivateWarranty.value.customerName ||
                        'string',
                    phoneNumber:
                        this.createActivateWarranty.value.phoneNumber ||
                        'string',
                    wardId: this.createActivateWarranty.value.wardId.id || 0,
                    wardName:
                        this.createActivateWarranty.value.wardId.name || 0,
                    districtId:
                        this.createActivateWarranty.value.districtId.id || 0,
                    districtName:
                        this.createActivateWarranty.value.districtId.name || 0,
                    cityId: this.createActivateWarranty.value.cityId.id || 0,
                    cityName:
                        this.createActivateWarranty.value.cityId.name || 0,
                },
                warrantyProducts: this.productListSelected.map((product) => ({
                    productId: product.productId,
                    productVariantId: product.productVariantId,
                    // warrantyId: 0, // Giá trị mẫu, thay thế nếu cần
                    productName: product.productVariant.productName,
                    inventoryStockDetailProductImeiId: product.id,
                    expirationDate: '2024-09-25T03:46:03.105Z', // Giá trị mẫu, thay thế nếu cần
                })),
            };

            this.warrantyService.createWarranty(formData).subscribe(
                (response) => {
                    this.router.navigate([`/activate-success/${response}`]);
                },
                (error) => {
                    // Xử lý khi lỗi
                    console.error('Error creating inventoryStockIn:', error);
                }
            );
        } else {
            // Nếu form không hợp lệ, có thể hiển thị thông báo lỗi
            console.log('Form is invalid');
            alert('Vui lòng điền đầy đủ thông tin trước khi gửi.');
        }
    }
}
