import { version } from 'moment-timezone';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    NgForm,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { OptionsFilterCommodities } from 'src/app/core/models/option-filter-commodities';
import { BranchService } from 'src/app/core/services/branch.service';
import { RoleService } from 'src/app/core/services/role.service';
import { AddressService } from 'src/app/core/services/address.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
    filterForm!: FormGroup;
    totalRecords: number = 0;
    maxLength: number = 100;
    isSubmitting: boolean = false;
    isWhitespaceOnlys: boolean = false;
    showDialog4 = false;
    selectedCommodityId: number | null = null;
    branch: any[] = [];
    Roles: any[] = [];
    PageIndex: number = 1;
    PageSize: number = 30;
    WordSearch: string = '';
    RoleGroupForm!: FormGroup;
    RoleGroupForm2!: FormGroup;
    pageSize: number = 30;
    pageNumber: number = 1;
    Name!: string;
    PhoneNumber!: string;
    Address!: string;
    users: any[] = [];
    commodities: any[] = [];
    commoditiesForm!: FormGroup;
    commoditiesForm2!: FormGroup;
    selectedName!: string;
    selectedPhoneNumber!: string;
    selectedAddress!: string;
    savingInProgress = false;
    roleSelected: boolean = false;
    roleGroupId: number | null = null;
    selectedRoleGroupId: number | null = null;
    cities: any[] = [];
    districts: any[] = [];
    wards: any[] = [];
    selectedCountryId!: number;
    selectedCityId!: number;
    selectedDistrictId!: number;
    selectedWardId!: number;

    optionsFilterCommodities: OptionsFilterCommodities =
        new OptionsFilterCommodities();

    autoCompleteCustomer: any;
    autoCompleteEmployeeDraw: any;

    selectedItem: any;
    commoditySelected: any;
    commoditiesSearch: any;

    listSubjects: any;
    subjectSelected: any;
    createdAt: any;
    messages!: any[];
    comodity: any;
    employessById!: any;
    employessId2: any;

    errorMessage: string | null = null;
    showNameError: boolean = false;
    showNameError2: boolean = false;
    showNameError3: boolean = false;
    showNameError4: boolean = false;
    showNameError5: boolean = false;
    showDialog = false;
    showDialog2 = false;
    showDialog3 = false;
    rolesError: boolean = false;

    formatdate: string = 'dd/mm/yy';
    autoCompleteSubject: any;
    currentPageReport: string = '';
    isRolesTouched: boolean = false;

    constructor(
        private usersService: UserService,
        private branchService: BranchService,
        private roleService: RoleService,
        private addressService: AddressService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.RoleGroupForm = this.fb.group({
            name: ['', Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(100),
                this.noWhitespaceValidator
            ])],
            phoneNumber: ['', [Validators.required, this.noWhitespaceValidator, Validators.pattern(/^(03|05|07|08|09)[0-9]{8}$/),
            Validators.minLength(10),
            Validators.maxLength(10),]],
            branchId: [null, Validators.required],
            roles: [[], Validators.required],
            branchName: [null, Validators.required],
            email: ['', Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(100),
                this.noWhitespaceValidator
            ])],
            password: ['', Validators.compose([
                Validators.required,
                Validators.minLength(6),
                Validators.maxLength(100),
                this.noWhitespaceValidator
            ])],
            address: [null, Validators.required],
            wardId: [null],
            cityId: [null],
            districtId: [null],
        });
        this.RoleGroupForm2 = this.fb.group({
            id: [''],
            name: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(100),
                    this.noWhitespaceValidator,
                ]),
            ],
            phoneNumber: [
                null,
                [
                    Validators.required,
                    Validators.pattern(/^(03|05|07|08|09)[0-9]{8}$/),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            departmentId: [0, Validators.required],
            dayOfBirth: [null],
            accountName: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(100),
                    Validators.required,
                    Validators.pattern('^[a-zA-Z0-9]*$'),
                    this.noWhitespaceValidator,
                ]),
            ],
            password: [null, Validators.required],
            email: [null, [Validators.required, Validators.email]],
            roleGroupId: ['', Validators.required],
            roleGroupName: [null],
            roleGroup: [null],
            code: [null],
            version: [null],
            // userRegist: this.fb.group({

            // })
        });
    }

    isWhitespace(str: string) {
        return str.trim().length === 0;
    }

    get rolesControl() {
        return this.RoleGroupForm.get('roles');
    }

    // Hàm kiểm tra khi rời khỏi p-multiSelect
    checkRolesSelection() {
        // Kiểm tra nếu trường chưa có giá trị
        if (!this.rolesControl?.value || this.rolesControl.value.length === 0) {
            this.rolesControl.setErrors({ required: true }); // Đặt lỗi required
            this.rolesControl.markAsTouched(); // Đánh dấu trường là touched
        } else {
            this.rolesControl.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
        }
    }


    get username() {
        return this.RoleGroupForm.get('username');
    }

    ngOnInit() {
        this.getCitiesByCountry(1);
        this.Filters();
        this.getAllFilterBranch();
        this.getAllFilterRole();
    }

    getAllFilterBranch(): void {
        this.branchService.getBranchsAll().subscribe((response: any) => {
            this.branch = response.data.items;
        });
    }

    getAllFilterRole(): void {
        this.roleService.getRoleAll().subscribe((response: any) => {
            this.Roles = response.data.items;
        });
    }

    getCitiesByCountry(countryId: number) {
        this.addressService.getCitiesByIdCountry(countryId)
            .subscribe(cities => {
                this.cities = cities.data;
                //console.log(cities)
            });
    }

    getDistrictsByCity(cityId: number) {
        this.addressService.getDistrictsByIdCity(cityId)
            .subscribe(districts => {
                this.districts = districts.data;
            });
    }

    getWardsByDistrict(districtId: number) {
        this.addressService.getWardsByIdDistrict(districtId)
            .subscribe(wards => {
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
        this.RoleGroupForm.get('wardId')?.setValue(null);
        this.RoleGroupForm.get('districtId')?.setValue(null);
    }

    onDistrictChange(districtId: number) {
        this.selectedDistrictId = districtId;
        this.getWardsByDistrict(districtId);
        this.wards = [];
        this.RoleGroupForm.get('wardId')?.setValue(null);
    }

    onClearCity() {
        this.RoleGroupForm.get('wardId')?.setValue(null);
        this.RoleGroupForm.get('districtId')?.setValue(null);
    }

    onClearDistrict() {
        this.RoleGroupForm.get('wardId')?.setValue(null);
    }

    onClearWard() {
        this.RoleGroupForm.get('wardId')?.setValue(null);
    }


    Filters(): void {
        //debugger
        this.usersService.getFilters(this.PageSize, this.PageIndex, this.Name, this.PhoneNumber, this.Address)
            .subscribe(
                response => {
                    this.users = response.data.items;
                    this.totalRecords = response.data.totalRecords;
                    this.updateCurrentPageReport();
                    //console.log(this.users)
                },
                error => {
                    console.error('Error fetching filtered customers:', error);
                }
            );
    }

    clickButtonFilter() {
        if (this.selectedName) {
            this.Name = this.selectedName.trim();
            this.PhoneNumber = this.selectedPhoneNumber;
            this.Address = this.selectedAddress;
            this.PageIndex = 1;
            const elementshighlight = document.querySelectorAll(
                `p-paginator .p-highlight`
            );
            elementshighlight.forEach((element) => {
                element.classList.remove('p-highlight');
            });
            const elements = document.querySelectorAll(
                `p-paginator [aria-label="Page 1"]`
            );
            elements.forEach((element) => {
                element.classList.add('p-highlight');
            });
            this.Filters();
        } else {
            this.Name = this.selectedName.trim();
            this.PhoneNumber = this.selectedPhoneNumber;
            this.Address = this.selectedAddress;
            this.PageIndex = 1;
            const elementshighlight = document.querySelectorAll(
                `p-paginator .p-highlight`
            );
            elementshighlight.forEach((element) => {
                element.classList.remove('p-highlight');
            });
            const elements = document.querySelectorAll(
                `p-paginator [aria-label="Page 1"]`
            );
            elements.forEach((element) => {
                element.classList.add('p-highlight');
            });
            this.Filters();
        }
        this.Filters();
    }

    onInputChange(event: any) {
        const input = event.target;
        let trimmedValue = input.value.trim();

        if (trimmedValue.length > this.maxLength) {
            input.value = trimmedValue.substring(0, this.maxLength);
        }
        this.errorMessage = '';
    }

    noWhitespaceValidator(control: any) {
        const isWhitespace = (control.value || '').trim().length === 0;
        const isValid = !isWhitespace;
        return isValid ? null : { whitespace: true };
    }

    getErrorMessage() {
        if (this.RoleGroupForm.controls['name'].hasError('required')) {
            return 'Tên người dùng không được để trống';
        }
        return 'Tên người không được chứa toàn ký tự trắng';
    }

    getErrorMessage3() {
        if (this.RoleGroupForm.controls['email'].hasError('required')) {
            return 'Tên tài khoản không được để trống';
        }
        return 'Tên tài khoản không được chứa toàn ký tự trắng';
    }

    getErrorMessage4() {
        if (this.RoleGroupForm.controls['password'].hasError('required')) {
            return 'Mật khẩu không được để trống';
        }
        return 'Mật khẩu không được chứa toàn ký tự trắng';
    }

    getErrorMessage5() {
        if (this.RoleGroupForm.controls['phoneNumber'].hasError('required')) {
            return 'Số điện thoại không được để trống';
        }
        return 'Số điện thoại không được chứa toàn ký tự trắng';
    }

    getErrorMessage2() {
        if (this.RoleGroupForm2.controls['name'].hasError('required')) {
            return 'Tên nhân viên không được để trống';
        }
        return 'Tên nhân viên không được chứa toàn ký tự trắng';
    }

    onTextAreaChange(event: any) {
        const textarea = event.target;
        const trimmedValue = textarea.value.trim();
        const maxLength = 100;

        if (trimmedValue.length > maxLength) {
            textarea.value = trimmedValue.substring(0, maxLength);
            this.RoleGroupForm.get('description')?.setValue(textarea.value);
        }
    }

    // onPageChange(event: any) {
    //   this.optionsFilterCommodities.PageSize = event.rows;
    //   this.optionsFilterCommodities.PageIndex = event.page + 1;

    //   this.commodityService.FilterTCommondities(this.optionsFilterCommodities).subscribe((response) => {
    //     this.comodity = response.data;
    //     this.totalRecordsCount = response.totalRecordsCount;
    //   }, (err) => {
    //     this.comodity = null;
    //     this.totalRecordsCount = 0;
    //   })
    // }

    openDialog() {
        // this.showDialog = true;
        this.showDialog = true;
        // if (this.authService.hasRole('User_Create')) {
        //   this.showDialog = true;
        // } else {
        //   this.messages = [{
        //     severity: 'warn',
        //     summary: 'Không có quyền',
        //     detail: 'Bạn không có quyền truy cập',
        //     life: 3000
        //   }];
        // }
    }

    closeDialog() {
        this.showDialog = false;
        this.RoleGroupForm.reset();
        this.showNameError = false;
        this.showNameError2 = false;
        this.showNameError3 = false;
        this.showNameError4 = false;
        this.showNameError5 = false;
        this.errorMessage = null;
    }

    // openDialog2(employessId: number): void {
    //   if (this.authService.hasRole('User_GetOne')) {
    //     this.employessId2 = employessId;
    //     this.usersService.getEmployessById(employessId).subscribe(
    //       (response: any) => {
    //         if (response.isSucceeded) {
    //           this.employessById = response.data;
    //           if (this.employessById.dayOfBirth !== null) {
    //             const dateOfBirth = new Date(this.employessById.dayOfBirth);
    //             this.employessById.dayOfBirth = dateOfBirth;
    //           }
    //           this.showDialog2 = true;
    //           if (this.employessById.phoneNumber !== null) {
    //             const phonNumberTrim = this.employessById.phoneNumber.trim();
    //             this.employessById.phoneNumber = phonNumberTrim;
    //           }
    //           this.RoleGroupForm2.patchValue({
    //             id: this.employessById.id,
    //             code: this.employessById.code,
    //             name: this.employessById.name,
    //             accountName: this.employessById.accountName,
    //             dayOfBirth: this.employessById.dayOfBirth,
    //             phoneNumber: this.employessById.phoneNumber,
    //             roleGroupId: this.employessById.roleGroupId,
    //             roleGroupName: this.employessById.roleGroupName,
    //             roleGroup: this.Roles.find(role => role.id === this.employessById.roleGroupId),
    //             isDeleted: this.employessById.isDeleted,
    //             version: this.employessById.version,
    //           });
    //         } else {
    //           console.error("Failed to get brand by ID:", response.message);

    //         }
    //       },
    //       error => {
    //         console.error("Error:", error);
    //       }
    //     );
    //   } else {
    //     this.messages = [{
    //       severity: 'warn',
    //       summary: 'Không có quyền',
    //       detail: 'Bạn không có quyền truy cập',
    //       life: 3000
    //     }];
    //   }
    // }

    closeDialog2() {
        this.showDialog2 = false;
        this.RoleGroupForm2.reset();
        this.showNameError = false;
        this.showNameError2 = false;
        this.showNameError3 = false;
        this.showNameError4 = false;
        this.errorMessage = null;
    }

    onItemSelected2(event: any) {
        const selectedRole = event.value;
        if (selectedRole) {
            this.RoleGroupForm2.patchValue({
                roleGroupId: selectedRole.id,
                roleGroupName: selectedRole.name,
            });
        }
    }

    onInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const trimmedValue = inputElement.value.trim(); // Cắt ký tự khoảng trắng ở hai đầu chuỗi
        this.optionsFilterCommodities.name = trimmedValue;
    }

    redirectToUpdateCustomerPage(id: number): void {
        this.router.navigate(['/update-template-rd', id]);
    }

    openDialog4(id: number) {
        this.selectedCommodityId = id;
        this.showDialog4 = true;
    }

    closeDialog4() {
        this.showDialog4 = false;
    }

    onKeyPress(event: KeyboardEvent) {
        const inputChar = event.key;
        if (!this.isNumberKey(inputChar)) {
            event.preventDefault();
        }
    }

    isNumberKey(char: string) {
        return /^\d+$/.test(char);
    }

    // confirmDelete() {
    //   if (this.selectedCommodityId !== null) {
    //     this.commodityService.deleteCommodity(this.selectedCommodityId).subscribe(
    //       response => {
    //         //console.log('Delete successful', response);
    //         // Refresh the data or handle the UI changes
    //         this.closeDialog4();
    //         this.getAllFilterRoleGroup();
    //       },
    //       error => {
    //         console.error('Error deleting commodity', error);
    //       }
    //     );
    //   }
    // }

    private isHttpError(error: any): error is { StatusCode: number } {
        return error && typeof error.StatusCode === 'number';
    }

    checkUserExistsAndSubmit() {
        const formValues = this.RoleGroupForm.value;

        // Gọi service để kiểm tra sự tồn tại của người dùng
        this.usersService.checkUserExists(formValues.phoneNumber, formValues.email).subscribe(response => {
            if (response.data === true) {
                // Người dùng tồn tại, hiển thị thông báo lỗi
                // this.messages.add({ severity: 'error', summary: 'Lỗi', detail: 'Số điện thoại hoặc email đã tồn tại!' });
                this.messages = [{
                    severity: 'warn',
                    summary: 'Lỗi',
                    detail: 'Số điện thoại hoặc email đã tồn tại!',
                    life: 3000
                }];
            } else {
                // Người dùng không tồn tại, gọi hàm onSubmit để tiếp tục
                this.onSubmit();
            }
        }, error => {
            // Xử lý lỗi khi gọi API
            console.error('Có lỗi xảy ra khi kiểm tra tồn tại người dùng', error);
        });
    }

    async onSubmit() {
        if (this.savingInProgress) {
            return;
        }

        this.isSubmitting = true;
        const formValues = this.RoleGroupForm.value;

        let hasError = false;

        this.checkRolesSelection()

        if (!formValues.name || formValues.name.length === 0) {
            this.showNameError = true;
            hasError = true;
        }

        if (!formValues.branchId || formValues.branchId.length === 0) {
            this.showNameError2 = true;
            hasError = true;
        }

        if (!formValues.email || formValues.email.length === 0) {
            this.showNameError3 = true;
            hasError = true;
        }

        if (!formValues.password || formValues.password.length === 0) {
            this.showNameError4 = true;
            hasError = true;
        }

        if (!formValues.phoneNumber || formValues.phoneNumber.length === 0) {
            this.showNameError5 = true;
            hasError = true;
        }

        if (formValues.phoneNumber && formValues.phoneNumber.length != 10) {
            hasError = true;
          }

        if (hasError) {
            this.messages = [{
                severity: 'error',
                summary: 'Không thể lưu vì:',
                detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
                life: 5000
            }];
            this.isSubmitting = false;
            return
        }
        try {
            this.savingInProgress = true;
            const selectedCity = this.cities.find(city => city.id === formValues.cityId)?.name || '';
            const selectedDistrict = this.districts.find(district => district.id === formValues.districtId)?.name || '';
            const selectedWard = this.wards.find(ward => ward.id === formValues.wardId)?.name || '';

            // Tạo chuỗi địa chỉ bằng cách nối các giá trị lại với nhau
            const address = `${selectedCity} - ${selectedDistrict} - ${selectedWard}`.trim();

            const userData = {
                name: formValues.name,
                branchId: formValues.branchId,
                branchName: this.branch.find(branch => branch.id === formValues.branchId)?.name || '',
                email: formValues.email,
                phoneNumber: formValues.phoneNumber,
                password: formValues.password,
                status: true,  // Hoặc giá trị khác nếu cần
                address: address, // Địa chỉ đã được tạo
                role: formValues.roles.map(role => role.name) // Lấy tên của các nhóm quyền
            };

            // Gửi yêu cầu tới API để thêm người dùng
            this.usersService.createUser(userData).subscribe(response => {
                console.log('Người dùng đã được tạo thành công', response);
                this.messages = [{
                    severity: 'success',
                    summary: 'Thành công',
                    detail: 'Khách hàng đã được thêm thành công',
                    life: 3000
                }];
                this.closeDialog();  // Đóng dialog sau khi thêm thành công
                this.Filters();
            }, error => {
                console.error('Có lỗi xảy ra khi thêm người dùng', error);
            });
        } catch (error) {
            this.messages = [{
                severity: 'error',
                summary: 'Không thể lưu vì:',
                detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
                life: 3000
            }];
            // this.filterCustomers();
        } finally {
            this.savingInProgress = false;
        }
    }

    onPageChange(event: any): void {
        this.PageIndex = event.page + 1;
        this.PageSize = event.rows;
        this.Filters();
    }

    goToPreviousPage(): void {
        if (this.PageIndex > 1) {
            this.PageIndex--;
            this.Filters();
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecords / this.PageSize);
        if (this.PageIndex < lastPage) {
            this.PageIndex++;
            this.Filters();
        }
    }
    updateCurrentPageReport(): void {
        const startRecord = (this.PageIndex - 1) * this.PageSize + 1;
        const endRecord = Math.min(
            this.PageIndex * this.PageSize,
            this.totalRecords
        );
        this.currentPageReport = `<strong>${startRecord}</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecords}</strong> bản ghi`;
    }
}
