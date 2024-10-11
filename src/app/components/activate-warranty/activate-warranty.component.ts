import { BranchService } from './../../core/services/branch.service';
import { AddressService } from 'src/app/core/services/address.service';
import { ProductImeiService } from './../../core/services/product-imei.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WarrantyService } from 'src/app/core/services/warranty.service';
import { Router } from '@angular/router';
import { forkJoin, switchMap, tap } from 'rxjs';
import { CustomerService } from 'src/app/core/services/customer.service';
import { OptionsFilterCustomer } from 'src/app/core/DTOs/customer/optionsFilterCustomers';
import { AuthService } from 'src/app/core/services/auth.service';
import { OptionsFilterBranch } from 'src/app/core/DTOs/branch/optionsFilterBranchs';
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
    optionsFilterCustomer: OptionsFilterCustomer = new OptionsFilterCustomer();
    countries: any[] | undefined;
    filteredCountries: any[] | undefined;
    createActivateWarranty: FormGroup;
    customers: any;
    userCurrent: any;
    constructor(
        private productImeiService: ProductImeiService,
        private addressService: AddressService,
        private formBuilder: FormBuilder,
        private customerService: CustomerService,
        private warrantyService: WarrantyService,
        private branchService: BranchService,
        private router: Router,
        private authService: AuthService
    ) {
        this.createActivateWarranty = this.formBuilder.group({
            branch: [null, [Validators.required]],
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

        this.authService.userCurrent.subscribe((res) => {
            this.userCurrent = res;
            console.log(this.userCurrent);
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
    customerId: any;
    branchs: any[] = [];
    optionsFilterBranch: OptionsFilterBranch = new OptionsFilterBranch();

    selectedBranch: any;
    // brandIdSelected: any;
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

    searchBranch(event: AutoCompleteCompleteEvent) {
        this.optionsFilterBranch.name = event.query;
        this.loadBranchs();
    }

    loadBranchs() {
        this.branchService
            .getBranchs(this.optionsFilterBranch)
            .subscribe((data) => {
                console.log(data);
                this.branchs = data.data.items;
                console.log(this.branchs);
            });
    }

    loadCustomers() {
        this.customerService
            .getCustomers(this.optionsFilterCustomer)
            .subscribe((data) => {
                console.log(data);
                this.customers = data.data.items;
            });
    }

    search(event: AutoCompleteCompleteEvent) {
        this.optionsFilterCustomer.Keyword = event.query;
        this.loadCustomers();
    }

    onSelect(event: any) {
        const selectedCustomer = event.value; // Dữ liệu khách hàng đã chọn
        console.log(selectedCustomer);

        this.districts = this.getDistrictsByCity(
            Number(selectedCustomer.cityId)
        );

        this.wards = this.getWardsByDistrict(
            Number(selectedCustomer.districtId)
        );

        this.createActivateWarranty.patchValue({
            phoneNumber: selectedCustomer.phoneNumber.trim(),
            customerName: selectedCustomer.name,
            cityId: Number(selectedCustomer.cityId) || null,
            districtId: Number(selectedCustomer.districtId) || null,
            wardId: selectedCustomer.wardId || null,
            address: selectedCustomer.addressDetail || null,
        });

        console.log(this.createActivateWarranty.value);
    }

    // onCustomerSelect(event: any) {
    //     const customerId = event.value.id;
    //     this.warrantyService
    //         .getWarrantyByCustomer(customerId)
    //         .subscribe((data) => {
    //             this.warrantyId = data.data.items[0].id;
    //             this.productList = data.data.items[0].warrantyProducts;
    //             console.log(this.productList);
    //         });

    //     this.listCart = [];
    // }

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

                                if (!isProductExists && product.term) {
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
        console.log(event);

        this.selectedCityId = event.value.id || event.value;
        this.getDistrictsByCity(event.value.id);
        this.districts = [];
        this.wards = [];
        this.createActivateWarranty.get('wardId')?.setValue(null);
        this.createActivateWarranty.get('districtId')?.setValue(null);
    }

    onDistrictChange(event: any, districtId: number) {
        console.log(event);
        this.selectedDistrictId = event.value.id || event.value;
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
    // onSubmit() {
    //     if (this.createActivateWarranty.valid) {
    //         // Tạo mảng để lưu trữ dữ liệu bảo hành cho tất cả sản phẩm

    //         const formDataCus = {
    //             name:
    //                 this.createActivateWarranty.value.customerName || 'string',
    //             phoneNumber:
    //                 this.createActivateWarranty.value.phoneNumber || 'string',
    //             wardId: this.createActivateWarranty.value.wardId?.id,
    //             wardName: this.createActivateWarranty.value.wardId?.name,
    //             districtId: this.createActivateWarranty.value.districtId?.id,
    //             districtName:
    //                 this.createActivateWarranty.value.districtId?.name,
    //             cityId: this.createActivateWarranty.value.cityId?.id,
    //             cityName: this.createActivateWarranty.value.cityId?.name,
    //             addressDetail: this.createActivateWarranty.value.address,
    //         };

    //         this.customerService
    //             .createCustomer(formDataCus)
    //             .subscribe((item) => {
    //                 this.customerId = item.data.id;
    //             });

    //         const warrantyProducts = this.productListSelected.map((product) => {
    //             return {
    //                 productId: product.productId,
    //                 productVariantId: product.productVariantId,
    //                 productName: product.productVariant.productName,
    //                 value1: product.productVariant.valuePropeties1,
    //                 value2: product.productVariant.valuePropeties2,
    //                 sk: product.frameNumber,
    //                 sm: product.engineNumber,
    //                 inventoryStockDetailProductImeiId: product.id,
    //                 expirationDate: product.term
    //                     ? this.calculateExpirationDate(
    //                           product.term,
    //                           product.termType
    //                       )
    //                     : new Date(
    //                           new Date().getTime() + 7 * 60 * 60 * 1000
    //                       ).toISOString(),
    //             };
    //         });

    //         const formData = {
    //             code: 'string', // Bạn có thể thay thế giá trị này từ form nếu cần
    //             customerName:
    //                 this.createActivateWarranty.value.customerName || 'string',
    //             branchId: this.productListSelected[0]?.branchId || 5, // Lấy branchId từ sản phẩm đầu tiên
    //             branchName:
    //                 this.productListSelected[0]?.branchName ||
    //                 'Chi nhánh Khoái Châu',
    //             phoneNumber:
    //                 this.createActivateWarranty.value.phoneNumber || 'string',
    //             wardName: this.createActivateWarranty.value.wardId?.name || '',

    //             customerId: this.customerId,
    //             districtName:
    //                 this.createActivateWarranty.value.districtId?.name || '',
    //             cityName: this.createActivateWarranty.value.cityId?.name || '',
    //             customer: null,
    //             warrantyProducts, // Gán mảng sản phẩm vào formData
    //         };

    //         // Lưu vào localStorage
    //         localStorage.setItem(
    //             'lastCreatedWarranties',
    //             JSON.stringify(formData)
    //         );

    //         // Gọi API tạo bảo hành cho từng sản phẩm
    //         const observables = this.productListSelected.map((product) => {
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

    //             // Lấy dữ liệu đã lưu từ localStorage
    //             const storedData = JSON.parse(
    //                 localStorage.getItem('lastCreatedWarranties') || '[]'
    //             );

    //             // Thêm dữ liệu mới vào mảng
    //             storedData.push(formData);

    //             // Lưu lại mảng dữ liệu vào localStorage
    //             localStorage.setItem(
    //                 'lastCreatedWarranties',
    //                 JSON.stringify(storedData)
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

    // onSubmit() {
    //     if (this.createActivateWarranty.valid) {
    //         // Tạo mảng để lưu trữ dữ liệu bảo hành cho tất cả sản phẩm
    //         const formDataCus = {
    //             name:
    //                 this.createActivateWarranty.value.customerName || 'string',
    //             phoneNumber:
    //                 this.createActivateWarranty.value.phoneNumber || 'string',
    //             wardId: this.createActivateWarranty.value.wardId?.id,
    //             wardName: this.createActivateWarranty.value.wardId?.name,
    //             districtId: this.createActivateWarranty.value.districtId?.id,
    //             districtName:
    //                 this.createActivateWarranty.value.districtId?.name,
    //             cityId: this.createActivateWarranty.value.cityId?.id,
    //             cityName: this.createActivateWarranty.value.cityId?.name,
    //             addressDetail: this.createActivateWarranty.value.address,
    //         };

    //         // Sử dụng switchMap để đợi tạo customer xong rồi mới tiếp tục
    //         this.customerService
    //             .createCustomer(formDataCus)
    //             .pipe(
    //                 switchMap((item) => {
    //                     this.customerId = item.data.id;

    //                     const warrantyProducts = this.productListSelected.map(
    //                         (product) => {
    //                             return {
    //                                 productId: product.productId,
    //                                 productVariantId: product.productVariantId,
    //                                 productName:
    //                                     product.productVariant.productName,
    //                                 value1: product.productVariant
    //                                     .valuePropeties1,
    //                                 value2: product.productVariant
    //                                     .valuePropeties2,
    //                                 sk: product.frameNumber,
    //                                 sm: product.engineNumber,
    //                                 inventoryStockDetailProductImeiId:
    //                                     product.id,
    //                                 expirationDate: product.term
    //                                     ? this.calculateExpirationDate(
    //                                           product.term,
    //                                           product.termType
    //                                       )
    //                                     : new Date(
    //                                           new Date().getTime() +
    //                                               7 * 60 * 60 * 1000
    //                                       ).toISOString(),
    //                             };
    //                         }
    //                     );

    //                     const formData = {
    //                         code: 'string',
    //                         customerName:
    //                             this.createActivateWarranty.value
    //                                 .customerName || 'string',
    //                         branchId:
    //                             this.productListSelected[0]?.branchId || 5,
    //                         branchName:
    //                             this.productListSelected[0]?.branchName ||
    //                             'Chi nhánh Khoái Châu',
    //                         phoneNumber:
    //                             this.createActivateWarranty.value.phoneNumber ||
    //                             'string',
    //                         wardName:
    //                             this.createActivateWarranty.value.wardId
    //                                 ?.name || '',
    //                         customerId: this.customerId,
    //                         districtName:
    //                             this.createActivateWarranty.value.districtId
    //                                 ?.name || '',
    //                         cityName:
    //                             this.createActivateWarranty.value.cityId
    //                                 ?.name || '',
    //                         customer: null,
    //                         warrantyProducts,

    //                         cusSuccess: formDataCus,
    //                     };

    //                     // Lưu vào localStorage
    //                     localStorage.setItem(
    //                         'lastCreatedWarranties',
    //                         JSON.stringify(formData)
    //                     );

    //                     // Tạo mảng các observable cho từng sản phẩm
    //                     const observables = this.productListSelected.map(
    //                         (product) => {
    //                             return this.warrantyService.createWarranty(
    //                                 formData
    //                             );
    //                         }
    //                     );

    //                     // Sử dụng forkJoin để gọi tất cả API createWarranty cho từng sản phẩm
    //                     return forkJoin(observables).pipe(
    //                         switchMap((responses) => {
    //                             const inventoryStockDetailProductImeiIds =
    //                                 this.productListSelected.map(
    //                                     (product) => product.id
    //                                 );
    //                             const formData1 = {
    //                                 inventoryStockDetailProductImeiIds,
    //                             };

    //                             // Cập nhật trạng thái Purchased
    //                             return this.warrantyService.updatePurchased(
    //                                 formData1
    //                             );
    //                         })
    //                     );
    //                 })
    //             )
    //             .subscribe(
    //                 (response) => {
    //                     // Xử lý thành công
    //                     this.router.navigate(['/activate-success']);
    //                 },
    //                 (error) => {
    //                     console.error('Error during the process:', error);
    //                 }
    //             );
    //     } else {
    //         console.log('Form is invalid');
    //         this.createActivateWarranty.markAllAsTouched();
    //     }
    // }

    onSubmit() {
        console.log(this.createActivateWarranty.value);

        console.log(this.selectedBranch);
        if (this.createActivateWarranty.valid) {
            // Tạo thông tin khách hàng
            const formDataCus = {
                name:
                    this.createActivateWarranty.value.customerName || 'string',
                phoneNumber:
                    this.createActivateWarranty.value.phoneNumber || 'string',
                wardId: this.createActivateWarranty.value.wardId?.id,
                wardName: this.createActivateWarranty.value.wardId?.name,
                districtId: this.createActivateWarranty.value.districtId?.id,
                districtName:
                    this.createActivateWarranty.value.districtId?.name,
                cityId: this.createActivateWarranty.value.cityId?.id,
                cityName: this.createActivateWarranty.value.cityId?.name,
                addressDetail: this.createActivateWarranty.value.address,
            };
            // Tạo khách hàng trước khi tạo phiếu bảo hành
            this.customerService
                .createCustomer(formDataCus)
                .pipe(
                    switchMap((item) => {
                        // Lấy ID của khách hàng vừa tạo
                        this.customerId = item.data.id;
                        // Khởi tạo mảng để lưu tất cả các phiếu bảo hành
                        const allWarranties = [];
                        // Tạo mảng các observable cho từng sản phẩm, mỗi sản phẩm sẽ có 1 phiếu bảo hành riêng
                        const observables = this.productListSelected.map(
                            (product) => {
                                // Tạo thông tin bảo hành cho từng sản phẩm
                                const warrantyProduct = {
                                    productId: product.productId,
                                    productVariantId: product.productVariantId,
                                    productName:
                                        product.productVariant.productName,
                                    value1: product.productVariant
                                        .valuePropeties1,
                                    value2: product.productVariant
                                        .valuePropeties2,
                                    sk: product.frameNumber,
                                    sm: product.engineNumber,
                                    quantity: -1,
                                    inventoryStockDetailProductImeiId:
                                        product.id,
                                    expirationDate: product.term
                                        ? this.calculateExpirationDate(
                                              product.term,
                                              product.termType
                                          )
                                        : new Date(
                                              new Date().getTime() +
                                                  7 * 60 * 60 * 1000
                                          ).toISOString(),
                                };
                                // Dữ liệu phiếu bảo hành cho từng sản phẩm

                                const formData = {
                                    code: 'string',
                                    customerName:
                                        this.createActivateWarranty.value
                                            .customerName || 'string',
                                    branchId:
                                        this.createActivateWarranty.value.branch
                                            .id || 1,
                                    branchName:
                                        this.createActivateWarranty.value.branch
                                            .name || 'Chi nhánh Khoái Châu',
                                    phoneNumber:
                                        this.createActivateWarranty.value
                                            .phoneNumber || 'string',
                                    wardName:
                                        this.createActivateWarranty.value.wardId
                                            ?.name || '',
                                    customerId: this.customerId, // Cùng 1 khách hàng cho tất cả sản phẩm
                                    districtName:
                                        this.createActivateWarranty.value
                                            .districtId?.name || '',
                                    cityName:
                                        this.createActivateWarranty.value.cityId
                                            ?.name || '',
                                    customer: null,
                                    warrantyProducts: [warrantyProduct], // Mỗi lần chỉ chứa 1 sản phẩm
                                    cusSuccess: formDataCus,
                                };
                                // Lưu từng phiếu bảo hành vào mảng
                                allWarranties.push(formData);
                                // Gọi API tạo phiếu bảo hành cho sản phẩm này
                                return this.warrantyService.createWarranty(
                                    formData
                                );
                            }
                        );
                        // Sử dụng forkJoin để gọi song song tất cả các API tạo phiếu bảo hành
                        return forkJoin(observables).pipe(
                            switchMap((responses) => {
                                const inventoryStockDetailProductImeiIds =
                                    this.productListSelected.map(
                                        (product) => product.id
                                    );
                                const formData1 = {
                                    inventoryStockDetailProductImeiIds,
                                };
                                // Sau khi tạo phiếu bảo hành, cập nhật trạng thái Purchased cho tất cả sản phẩm
                                return this.warrantyService.updatePurchased(
                                    formData1
                                );
                            }),
                            // Sau khi xử lý xong, lưu tất cả phiếu bảo hành vào localStorage
                            tap(() => {
                                console.log(
                                    'Warranties to be saved:',
                                    allWarranties
                                );
                                localStorage.setItem(
                                    'lastCreatedWarranties',
                                    JSON.stringify(allWarranties)
                                );
                            })
                        );
                    })
                )
                .subscribe(
                    (response) => {
                        // Xử lý thành công
                        this.router.navigate(['/activate-success']);
                    },
                    (error) => {
                        console.error('Error during the process:', error);
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
