import { version } from 'moment-timezone';
import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user.service';
import { OptionsFilterCommodities } from 'src/app/core/models/option-filter-commodities';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  filterForm!: FormGroup;
  totalRecordsCount: number = 0;
  maxLength: number = 100;
  isSubmitting: boolean = false;
  isWhitespaceOnlys: boolean = false;
  showDialog4 = false;
  selectedCommodityId: number | null = null;
  Roles: any[] = [];
  PageIndex: number = 1;
  PageSize: number = 30;
  WordSearch: string = "";
  RoleGroupForm!: FormGroup;
  RoleGroupForm2!: FormGroup;
  pageSize: number = 30;
  pageNumber: number = 1;
  keySearch!: string;
  users: any[] = [];
  commodities: any[] = [];
  commoditiesForm!: FormGroup;
  commoditiesForm2!: FormGroup;
  selectedKeySearch!: string;
  savingInProgress = false;
  roleSelected: boolean = false;
  roleGroupId: number| null = null;
  selectedRoleGroupId: number| null = null;

  optionsFilterCommodities: OptionsFilterCommodities = new OptionsFilterCommodities();

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

  formatdate: string = "dd/mm/yy";
  autoCompleteSubject: any;
  currentPageReport: string = '';

  constructor(
    private usersService: UserService,
    private router: Router,
    private fb: FormBuilder) {
    this.RoleGroupForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        this.noWhitespaceValidator
      ])],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^(03|05|07|08|09)[0-9]{8}$/),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      departmentId: [0, Validators.required],
      dayOfBirth: [null,],
      userRegist: this.fb.group({
        userName: ['', Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'),
          this.noWhitespaceValidator
        ])],
        password: [null, Validators.required],
        email: [null, [Validators.required, Validators.email]],
        roleGroupId: ['', Validators.required]
      })
    });
    this.RoleGroupForm2 = this.fb.group({
      id: [''],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        this.noWhitespaceValidator
      ])],
      phoneNumber: [null, [Validators.required, Validators.pattern(/^(03|05|07|08|09)[0-9]{8}$/),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      departmentId: [0, Validators.required],
      dayOfBirth: [null],
      accountName: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        Validators.required, Validators.pattern('^[a-zA-Z0-9]*$'),
        this.noWhitespaceValidator
      ])],
      password: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      roleGroupId: ['', Validators.required],
      roleGroupName: [null],
      roleGroup: [null],
      code: [null],
      version: [null]
      // userRegist: this.fb.group({

      // })
    });
  }

  isWhitespace(str: string) {
    return str.trim().length === 0;
  }

  get username() {
    return this.RoleGroupForm.get('username');
  }

  ngOnInit() {
    // this.getAllFilterRoleGroup();
    // this.Filters();
  }

  // getAllFilterRoleGroup(): void {
  //   this.authenticationService.GetAllRoleGroup(this.pageSize, this.pageNumber, this.WordSearch).subscribe((response: any) => {
  //     this.Roles = response.data;
  //   });
  // }

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
    return isValid ? null : { 'whitespace': true };
  }

  getErrorMessage() {
    if (this.RoleGroupForm.controls['name'].hasError('required')) {
      return 'Tên nhân viên không được để trống';
    }
    return 'Tên nhân viên không được chứa toàn ký tự trắng';
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
  ClickFilter() {
    this.optionsFilterCommodities.PageSize = this.optionsFilterCommodities.PageSize;
    this.optionsFilterCommodities.PageIndex = 1;

    // this.commodityService.FilterTCommondities(this.optionsFilterCommodities).subscribe((response) => {
    //   this.comodity = response.data;
    //   this.totalRecordsCount = response.totalRecordsCount;
    // }, (err) => {
    //   this.comodity = null;
    //   this.totalRecordsCount = 0;
    // });
  }

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

  // async onSubmit() {
  //   //debugger
  //   if (this.savingInProgress) {
  //     return;
  //   }

  //   this.isSubmitting = true;
  //   const commo = this.RoleGroupForm.value;

  //   let hasError = false;

  //   if (!commo.userRegist.roleGroupId || commo.userRegist.roleGroupId.length === 0) {
  //     this.showNameError = true;
  //     hasError = true;
  //   }

  //   if (!commo.name || commo.name.length === 0) {
  //     this.showNameError2 = true;
  //     hasError = true;
  //   }

  //   if (!commo.userRegist.userName || commo.userRegist.userName.length === 0) {
  //     this.showNameError3 = true;
  //     hasError = true;
  //   }

  //   if (!commo.name || commo.name.length < 6) {
  //     hasError = true;
  //   }

  //   if (commo.phoneNumber && commo.phoneNumber.length != 10) {
  //     hasError = true;
  //   }

  //   if (!commo.userRegist.userName || commo.userRegist.userName.length < 6) {
  //     hasError = true;
  //   }

  //   if (hasError) {
  //     this.messages = [{
  //       severity: 'error',
  //       summary: 'Không thể lưu vì:',
  //       detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
  //       life: 5000
  //     }];
  //     this.isSubmitting = false;
  //     return
  //   }

  //   this.errorMessage = null;

  //   try {
  //     this.savingInProgress = true;
  //     if (this.RoleGroupForm.value.dayOfBirth !== null) {
  //       const dateString = this.RoleGroupForm.value.dayOfBirth;
  //       const dateObject = moment.tz(dateString, 'ddd MMM DD YYYY HH:mm:ss GMTZZ (z)', 'Asia/Ho_Chi_Minh').add(7, 'hours');
  //       const isoString = dateObject.toISOString();
  //       this.RoleGroupForm.value.dayOfBirth = new Date(new Date(isoString).getTime() + (0 * 60 * 60 * 1000)).toISOString();
  //     }
  //     const createResponse = await this.usersService.createEmployee(this.RoleGroupForm.value).toPromise();
  //     //console.log('commodity created successfully!', createResponse);
  //     this.messages = [{
  //       severity: 'success',
  //       summary: 'Thành công',
  //       detail: 'Nhân viên đã được thêm thành công',
  //       life: 3000
  //     }];
  //     // this.filterCustomers();
  //     this.closeDialog();
  //     this.Filters();
  //   } catch (error) {
  //     let err = error as any;
  //     if (err.error.StatusCode === 4005) {
  //       this.errorMessage = 'Tên tài khoản đã tồn tại.';
  //     }
  //     this.messages = [{
  //       severity: 'error',
  //       summary: 'Không thể lưu vì:',
  //       detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
  //       life: 3000
  //     }];
  //     // this.filterCustomers();
  //   } finally {
  //     this.savingInProgress = false;
  //   }

  // }


  // async onUpdateSubmit() {
  //   if (this.authService.hasRole('User_Update')) {
  //     if (this.savingInProgress) {
  //       return;
  //     }

  //     this.isSubmitting = true;
  //     const commo = this.RoleGroupForm2.value;

  //     let hasError = false;

  //     if (!commo.roleGroupId || commo.roleGroupId.length === 0) {
  //       this.showNameError = true;
  //       hasError = true;
  //     }

  //     if (!commo.name || commo.name.length === 0) {
  //       this.showNameError2 = true;
  //       hasError = true;
  //     }

  //     if (!commo.accountName || commo.accountName.length === 0) {
  //       this.showNameError3 = true;
  //       hasError = true;
  //     }

  //     if (!commo.name || commo.name.length < 6) {
  //       this.showNameError2 = true;
  //       hasError = true;
  //     }

  //     if(commo.phoneNumber !== null) {
  //       const phonNumberTrim = commo.phoneNumber.trim()
  //       commo.phoneNumber = phonNumberTrim;
  //     }

  //     if (commo.phoneNumber && commo.phoneNumber.length != 10) {
  //       this.showNameError5 = true
  //       hasError = true;
  //     }

  //     if (!commo.accountName || commo.accountName.length < 6) {
  //       this.showNameError3 = true;
  //       hasError = true;
  //     }

  //     if (hasError) {
  //       this.messages = [{
  //         severity: 'error',
  //         summary: 'Không thể lưu vì:',
  //         detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
  //         life: 5000
  //       }];
  //       this.isSubmitting = false;
  //       return
  //     }

  //     this.errorMessage = null;
  //     // this.employessById.version++;

  //     try {
  //       this.savingInProgress = true;
  //       if (this.RoleGroupForm2.value.dayOfBirth !== null) {
  //         const dateString = this.RoleGroupForm2.value.dayOfBirth;
  //         const dateObject = moment.tz(dateString, 'ddd MMM DD YYYY HH:mm:ss GMTZZ (z)', 'Asia/Ho_Chi_Minh').add(7, 'hours');
  //         const isoString = dateObject.toISOString();
  //         this.RoleGroupForm2.value.dayOfBirth = new Date(new Date(isoString).getTime() + (0 * 60 * 60 * 1000)).toISOString();
  //       }
  //       const updateResponse = await this.usersService.updateEmployee(this.RoleGroupForm2.value).toPromise();
  //       //console.log('commodity updated successfully!', updateResponse);
  //       this.messages = [{
  //         severity: 'success',
  //         summary: 'Thành công',
  //         detail: 'Nhân viên đã được cập nhật thành công',
  //         life: 3000
  //       }];
  //       this.RoleGroupForm2.reset();
  //       this.closeDialog2();
  //       this.Filters();
  //     } catch (error) {
  //       let err = error as any;
  //       if (err.error.StatusCode === 4005) {
  //         this.errorMessage = 'Tên tài khoản đã tồn tại.';
  //       }
  //       this.messages = [{
  //         severity: 'error',
  //         summary: 'Không thể lưu vì:',
  //         detail: 'Thông tin đang có lỗi cần được chỉnh sửa',
  //         life: 3000
  //       }];
  //       // this.openDialog2(this.employessId2);
  //       this.Filters();
  //     } finally {
  //       this.savingInProgress = false;
  //       this.Filters();
  //     }
  //   } else {
  //     this.messages = [{
  //       severity: 'warn',
  //       summary: 'Không có quyền',
  //       detail: 'Bạn không có quyền cập nhật',
  //       life: 3000
  //     }];
  //   }

  // }

  // Filters(): void {
  //   //debugger
  //   this.usersService.getFilters(this.pageSize, this.pageNumber, this.keySearch, this.roleGroupId!)
  //     .subscribe(
  //       response => {
  //         this.users = response.data;
  //         this.totalRecordsCount = response.totalRecordsCount;
  //         this.updateCurrentPageReport();
  //         //console.log(this.users)
  //       },
  //       error => {
  //         console.error('Error fetching filtered customers:', error);
  //       }
  //     );
  // }
  clickButtonFilter() {
    if (this.selectedKeySearch) {
      this.keySearch = this.selectedKeySearch.trim();
      this.roleGroupId = this.selectedRoleGroupId;
      this.pageNumber = 1;
      const elementshighlight = document.querySelectorAll(`p-paginator .p-highlight`);
      elementshighlight.forEach(element => {
        element.classList.remove("p-highlight");
      });
      const elements = document.querySelectorAll(`p-paginator [aria-label="Page 1"]`);
      elements.forEach(element => {
        element.classList.add("p-highlight");
      });
      // this.Filters();
    } else {
      this.keySearch = this.selectedKeySearch;
      this.roleGroupId = this.selectedRoleGroupId;
      this.pageNumber = 1;
      const elementshighlight = document.querySelectorAll(`p-paginator .p-highlight`);
      elementshighlight.forEach(element => {
        element.classList.remove("p-highlight");
      });
      const elements = document.querySelectorAll(`p-paginator [aria-label="Page 1"]`);
      elements.forEach(element => {
        element.classList.add("p-highlight");
      });
      // this.Filters();
    }
    // this.Filters();
  }

  onPageChange(event: any): void {
    this.pageNumber = event.page + 1;
    this.pageSize = event.rows;
    // this.Filters();
  }

  goToPreviousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      // this.Filters();
    }
  }

  goToNextPage(): void {
    const lastPage = Math.ceil(this.totalRecordsCount / this.pageSize);
    if (this.pageNumber < lastPage) {
      this.pageNumber++;
      // this.Filters();
    }
  }
  updateCurrentPageReport(): void {
    const startRecord = ((this.pageNumber - 1) * this.pageSize) + 1;
    const endRecord = Math.min(this.pageNumber * this.pageSize, this.totalRecordsCount);
    this.currentPageReport = `<strong>${startRecord}</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecordsCount}</strong> nhân viên`
  }
}
