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
import { dA } from '@fullcalendar/core/internal-common';
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
    isSubmitting: boolean = false;
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
            branch: [null],
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

    qrResult: string;
    isScannerEnabled = false;
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

    toggleScanner() {
        this.isScannerEnabled = !this.isScannerEnabled;
    }

    handleQrCodeResult(result: string) {
        this.qrResult = result;
        this.isScannerEnabled = false; // Tắt máy quét sau khi quét thành công
    }

    onSearchProductEmei() {
        if (this.keywords) {
            // const keywordsArray = this.keywords.split('-');
            // const FrameNumber = keywordsArray[0]?.trim();
            // const EngineNumber = keywordsArray[1]?.trim();

            // this.key
            if (this.keywords) {
                setTimeout(() => {
                    this.productImeiService
                        .getProoductByEmei(this.keywords)
                        .subscribe(
                            (data) => {
                                const product = data?.data.items[0];
                                if (product) {
                                    const isProductExists =
                                        this.productListSelected.some(
                                            (p) => p.id === product.id // So sánh theo ID hoặc một thuộc tính duy nhất của sản phẩm
                                        );

                                    if (
                                        !isProductExists &&
                                        product.product.warrantyPolicy.term
                                    ) {
                                        this.productListSelected.push(product);
                                    } else {
                                        console.log(
                                            'Product already exists in the list'
                                        );
                                    }
                                    console.log(this.productListSelected);
                                } else {
                                    console.error('No product found');
                                }
                            },
                            (error) => {
                                console.error('Error fetching product:', error);
                            }
                        );
                }, 500);
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
        this.getDistrictsByCity(this.selectedCityId);
        this.districts = [];
        this.wards = [];
        this.createActivateWarranty.get('wardId')?.setValue(null);
        this.createActivateWarranty.get('districtId')?.setValue(null);
    }

    onDistrictChange(event: any, districtId: number) {
        console.log(event);
        this.selectedDistrictId = event.value.id || event.value;
        this.getWardsByDistrict(this.selectedDistrictId);
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
        console.log(this.createActivateWarranty.value);
        if (this.isSubmitting) {
            return; // Nếu đang gửi form, chặn không cho gửi tiếp
        }
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
                        this.customerId = item.data.id;
                        const allWarranties = [];
                        const observables = this.productListSelected.map(
                            (product) => {
                                // Tạo thông tin bảo hành cho từng sản phẩm
                                const warrantyProduct = {
                                    productId: product.productId,
                                    productVariantId: product.productVariantId,
                                    productName: product.productName,
                                    productVariantName:
                                        product.productVariantName,

                                    quantity: 1,
                                    inventoryStockDetailProductImeiId: null,
                                    expirationDate: product.product
                                        .warrantyPolicy.term
                                        ? this.calculateExpirationDate(
                                              product.product.warrantyPolicy
                                                  .term,
                                              product.product.warrantyPolicy
                                                  .termType
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
                                    branchId: product.branchId || 1,
                                    productCode: product.code.toString(),
                                    productCodeId: Number(product.id),
                                    branchName: product.branchName || '',
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
                                const updateRequests =
                                    this.productListSelected.map((product) => ({
                                        productCodeId: Number(product.id), // Lấy id từ danh sách sản phẩm đã chọn
                                        //Để tạm null
                                        warrantyStartDate: new Date(),
                                        warrantyEndDate: product.product
                                            .warrantyPolicy.term
                                            ? this.calculateExpirationDate(
                                                  product.product.warrantyPolicy
                                                      .term,
                                                  product.product.warrantyPolicy
                                                      .termType
                                              )
                                            : new Date(
                                                  new Date().getTime() +
                                                      7 * 60 * 60 * 1000
                                              ).toISOString(),
                                    }));

                                const formData1 = {
                                    updateProductCodeIsPurchaseRequests:
                                        updateRequests,
                                };
                                // Sau khi tạo phiếu bảo hành, cập nhật trạng thái Purchased cho tất cả sản phẩm
                                return this.warrantyService.updateProductCodePurchased(
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
                        this.isSubmitting = false;
                        this.router.navigate(['/activate-success']);
                    },
                    (error) => {
                        this.isSubmitting = false;
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
