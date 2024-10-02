import { AddressService } from 'src/app/core/services/address.service';
import { ProductImeiService } from './../../core/services/product-imei.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarrantyService } from 'src/app/core/services/warranty.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
            phoneNumber: [
                null,
                [Validators.required, Validators.pattern('^\\d{10}$')],
            ],
            customerName: [
                null,
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(100),
                ],
            ],

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

    // onSubmit() {
    //     if (this.createActivateWarranty.valid) {
    //         const observables = this.productListSelected.map((product) => {
    //             const formData = {
    //                 code: 'string', // Bạn có thể thay thế giá trị này từ form nếu cần
    //                 customerName:
    //                     this.createActivateWarranty.value.customerName ||
    //                     'string',
    //                 branchId: product.branchId || 5,
    //                 branchName: product.branchName || 'Chi nhánh Khoái Châu',
    //                 phoneNumber:
    //                     this.createActivateWarranty.value.phoneNumber ||
    //                     'string',
    //                 wardName:
    //                     this.createActivateWarranty.value.wardId?.name || '',
    //                 districtName:
    //                     this.createActivateWarranty.value.districtId?.name ||
    //                     '',
    //                 cityName:
    //                     this.createActivateWarranty.value.cityId?.name || '',
    //                 customer: {
    //                     name:
    //                         this.createActivateWarranty.value.customerName ||
    //                         'string',
    //                     phoneNumber:
    //                         this.createActivateWarranty.value.phoneNumber ||
    //                         'string',
    //                     wardId: this.createActivateWarranty.value.wardId?.id,
    //                     wardName:
    //                         this.createActivateWarranty.value.wardId?.name,
    //                     districtId:
    //                         this.createActivateWarranty.value.districtId?.id,
    //                     districtName:
    //                         this.createActivateWarranty.value.districtId?.name,
    //                     cityId: this.createActivateWarranty.value.cityId?.id,
    //                     cityName:
    //                         this.createActivateWarranty.value.cityId?.name,
    //                     addressDetail:
    //                         this.createActivateWarranty.value.address,
    //                 },
    //                 warrantyProducts: [
    //                     {
    //                         productId: product.productId,
    //                         productVariantId: product.productVariantId,
    //                         productName: product.productVariant.productName,
    //                         value1: product.productVariant.valuePropeties1,
    //                         value2: product.productVariant.valuePropeties2,
    //                         sk: product.frameNumber,
    //                         sm: product.engineNumber,
    //                         inventoryStockDetailProductImeiId: product.id,
    //                         expirationDate: product.term
    //                             ? this.calculateExpirationDate(
    //                                   product.term,
    //                                   product.termType
    //                               )
    //                             : new Date(
    //                                   new Date().getTime() + 7 * 60 * 60 * 1000
    //                               ).toISOString(),
    //                     },
    //                 ],
    //             };
    //             console.log(formData);

    //             localStorage.setItem(
    //                 'lastCreatedWarranties',
    //                 JSON.stringify(formData)
    //             );
    //             // Gọi API tạo bảo hành cho từng sản phẩm
    //             return this.warrantyService.createWarranty(formData);
    //         });

    //         // Gọi tất cả các yêu cầu tạo bảo hành
    //         forkJoin(observables).subscribe(
    //             (responses) => {
    //                 const inventoryStockDetailProductImeiIds =
    //                     this.productListSelected.map((product) => product.id);
    //                 const formData1 = {
    //                     inventoryStockDetailProductImeiIds,
    //                 };

    //                 this.warrantyService.updatePurchased(formData1).subscribe(
    //                     (response) => {
    //                         // Xử lý thành công
    //                     },
    //                     (error) => {
    //                         console.error(
    //                             'Error creating inventoryStockIn:',
    //                             error
    //                         );
    //                     }
    //                 );

    //                 // Điều hướng tới trang thành công
    //                 this.router.navigate(['/activate-success']);
    //             },
    //             (error) => {
    //                 console.error('Error creating warranties:', error);
    //             }
    //         );
    //     } else {
    //         console.log('Form is invalid');
    //         this.createActivateWarranty.markAllAsTouched();
    //     }
    // }

    onSubmit() {
        if (this.createActivateWarranty.valid) {
            const observables = this.productListSelected.map((product) => {
                const formData = {
                    code: 'string', // Bạn có thể thay thế giá trị này từ form nếu cần
                    customerName:
                        this.createActivateWarranty.value.customerName ||
                        'string',
                    branchId: product.branchId || 5,
                    branchName: product.branchName || 'Chi nhánh Khoái Châu',
                    phoneNumber:
                        this.createActivateWarranty.value.phoneNumber ||
                        'string',
                    wardName:
                        this.createActivateWarranty.value.wardId?.name || '',
                    districtName:
                        this.createActivateWarranty.value.districtId?.name ||
                        '',
                    cityName:
                        this.createActivateWarranty.value.cityId?.name || '',
                    customer: {
                        name:
                            this.createActivateWarranty.value.customerName ||
                            'string',
                        phoneNumber:
                            this.createActivateWarranty.value.phoneNumber ||
                            'string',
                        wardId: this.createActivateWarranty.value.wardId?.id,
                        wardName:
                            this.createActivateWarranty.value.wardId?.name,
                        districtId:
                            this.createActivateWarranty.value.districtId?.id,
                        districtName:
                            this.createActivateWarranty.value.districtId?.name,
                        cityId: this.createActivateWarranty.value.cityId?.id,
                        cityName:
                            this.createActivateWarranty.value.cityId?.name,
                        addressDetail:
                            this.createActivateWarranty.value.address,
                    },
                    warrantyProducts: [
                        {
                            productId: product.productId,
                            productVariantId: product.productVariantId,
                            productName: product.productVariant.productName,
                            value1: product.productVariant.valuePropeties1,
                            value2: product.productVariant.valuePropeties2,
                            sk: product.frameNumber,
                            sm: product.engineNumber,
                            inventoryStockDetailProductImeiId: product.id,
                            expirationDate: product.term
                                ? this.calculateExpirationDate(
                                      product.term,
                                      product.termType
                                  )
                                : new Date(
                                      new Date().getTime() + 7 * 60 * 60 * 1000
                                  ).toISOString(),
                        },
                    ],
                };

                // Lấy dữ liệu đã lưu từ localStorage
                const storedData = JSON.parse(
                    localStorage.getItem('lastCreatedWarranties') || '[]'
                );

                // Thêm dữ liệu mới vào mảng
                storedData.push(formData);

                // Lưu lại mảng dữ liệu vào localStorage
                localStorage.setItem(
                    'lastCreatedWarranties',
                    JSON.stringify(storedData)
                );

                // Gọi API tạo bảo hành cho từng sản phẩm
                return this.warrantyService.createWarranty(formData);
            });

            // Gọi tất cả các yêu cầu tạo bảo hành
            forkJoin(observables).subscribe(
                (responses) => {
                    const inventoryStockDetailProductImeiIds =
                        this.productListSelected.map((product) => product.id);
                    const formData1 = {
                        inventoryStockDetailProductImeiIds,
                    };

                    this.warrantyService.updatePurchased(formData1).subscribe(
                        (response) => {
                            // Xử lý thành công
                        },
                        (error) => {
                            console.error(
                                'Error creating inventoryStockIn:',
                                error
                            );
                        }
                    );

                    // Điều hướng tới trang thành công
                    this.router.navigate(['/activate-success']);
                },
                (error) => {
                    console.error('Error creating warranties:', error);
                }
            );
        } else {
            console.log('Form is invalid');
            this.createActivateWarranty.markAllAsTouched();
        }
    }

    removeProduct(index: number) {
        this.productListSelected.splice(index, 1); // Xóa sản phẩm khỏi danh sách
    }
    calculateExpirationDate(term: number, termType: number): string {
        const currentDate = new Date();

        // Lấy thời gian hiện tại theo múi giờ Việt Nam
        const vietnamTime = new Date(
            currentDate.toLocaleString('en-US', {
                timeZone: 'Asia/Ho_Chi_Minh',
            })
        );

        switch (termType) {
            case 1: // Ngày
                vietnamTime.setDate(vietnamTime.getDate() + term);
                break;
            case 2: // Tuần
                vietnamTime.setDate(vietnamTime.getDate() + term * 7);
                break;
            case 3: // Tháng
                vietnamTime.setMonth(vietnamTime.getMonth() + term);
                break;
            case 4: // Quý (3 tháng)
                vietnamTime.setMonth(vietnamTime.getMonth() + term * 3);
                break;
            case 5: // Năm
                vietnamTime.setFullYear(vietnamTime.getFullYear() + term);
                break;
            default:
                throw new Error('Invalid termType');
        }
        vietnamTime.setHours(vietnamTime.getHours() + 7);
        return vietnamTime.toISOString();
    }
}
