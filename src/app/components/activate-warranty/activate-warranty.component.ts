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
    onSubmit() {
        if (this.createActivateWarranty.valid) {
            console.log(this.createActivateWarranty.value);
            console.log(this.productListSelected);
            const formData = {
                code: 'string', // Bạn có thể thay thế giá trị này từ form nếu cần
                customerName:
                    this.createActivateWarranty.value.customerName || 'string',
                branchId: this.productListSelected[0]?.branchId
                    ? this.productListSelected[0]?.branchId
                    : 5,
                branchName: this.productListSelected[0]?.branchName
                    ? this.productListSelected[0]?.branchName
                    : '',
                phoneNumber:
                    this.createActivateWarranty.value.phoneNumber || 'string',
                wardName: this.createActivateWarranty.value.wardId?.name || '',
                districtName:
                    this.createActivateWarranty.value.districtId?.name || '',
                cityName: this.createActivateWarranty.value.cityId?.name || '',
                customer: {
                    name:
                        this.createActivateWarranty.value.customerName ||
                        'string',
                    phoneNumber:
                        this.createActivateWarranty.value.phoneNumber ||
                        'string',
                    wardId: this.createActivateWarranty.value.wardId?.id,
                    wardName: this.createActivateWarranty.value.wardId?.name,
                    districtId:
                        this.createActivateWarranty.value.districtId?.id,
                    districtName:
                        this.createActivateWarranty.value.districtId?.name,
                    cityId: this.createActivateWarranty.value.cityId?.id,
                    cityName: this.createActivateWarranty.value.cityId?.name,
                    addressDetail: this.createActivateWarranty.value.address,
                },
                warrantyProducts: this.productListSelected.map((product) => ({
                    productId: product.productId,
                    productVariantId: product.productVariantId,

                    // warrantyId: 0, // Giá trị mẫu, thay thế nếu cần
                    productName: product.productVariant.productName,
                    inventoryStockDetailProductImeiId: product.id,
                    expirationDate: this.calculateExpirationDate(
                        product.term,
                        product.termType
                    ),
                })),
            };
            this.warrantyService.createWarranty(formData).subscribe(
                (response) => {
                    const formData1 = {
                        inventoryStockDetailProductImeiIds:
                            this.productListSelected.map(
                                (product) => product.id
                            ),
                    };

                    this.warrantyService.updatePurchased(formData1).subscribe(
                        (response) => {},
                        (error) => {
                            // Xử lý khi lỗi
                            console.error(
                                'Error creating inventoryStockIn:',
                                error
                            );
                        }
                    );

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

        return vietnamTime.toISOString(); // Trả về định dạng ISO
    }
}
