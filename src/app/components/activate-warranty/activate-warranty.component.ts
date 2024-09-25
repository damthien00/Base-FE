import { AddressService } from 'src/app/core/services/address.service';
import { ProductImeiService } from './../../core/services/product-imei.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarrantyService } from 'src/app/core/services/warranty.service';
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
        private warrantyService: WarrantyService
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
                                this.productListSelected.push(product);
                                console.log(this.productListSelected);
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
                this.cities = cities.data;
                //console.log(cities)
            });
    }

    getDistrictsByCity(cityId: number) {
        this.addressService
            .getDistrictsByIdCity(cityId)
            .subscribe((districts) => {
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

    onCityChange(cityId: number) {
        this.selectedCityId = cityId;
        this.getDistrictsByCity(cityId);
        this.districts = [];
        this.wards = [];
        this.createActivateWarranty.get('wardId')?.setValue(null);
        this.createActivateWarranty.get('districtId')?.setValue(null);
    }

    onDistrictChange(districtId: number) {
        this.selectedDistrictId = districtId;
        this.getWardsByDistrict(districtId);
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

            const warrantyRequests = this.productListSelected.map(
                (product) => {}
            );

            const formData = {
                code: '', // Nếu có mã, hãy gán giá trị cho code
                customer: [
                    {
                        customerName:
                            this.createActivateWarranty.value.customerName,
                        phoneNumber:
                            this.createActivateWarranty.value.phoneNumber,
                        wardId: this.createActivateWarranty.value.wardId,
                    },
                ],
                product: [
                    {
                        // productId: product.id, // Sử dụng productVariant.id thay vì phoneNumber
                        // productVariantId: product.productVariant.id,
                        // productName: product.productVariant.productName,
                        // inventoryStockDetailProductImeiId: product.id,
                        // expirationDate: '2024-09-24T14:32:17.511Z',
                    },
                ],
            };

            this.warrantyService.createWarranty(formData).subscribe(
                (response) => {
                    // this.messageService.add({
                    //     severity: 'success',
                    //     summary: 'Thành công',
                    //     detail: 'Thêm phiếu kho thành công',
                    // });
                    // setTimeout(() => {
                    //     this.router.navigate(['/pages/warehouse/stock-in']);
                    // }, 1000); // Thời gian trễ 2 giây
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
