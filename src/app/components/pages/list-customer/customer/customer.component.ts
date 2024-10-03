import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/core/models/customer';
import { OptionsFilterLading } from 'src/app/core/models/option-filter-lading';
import { AuthService } from 'src/app/core/services/auth.service';
import { BranchService } from 'src/app/core/services/branch.service';
import { CustomerService } from 'src/app/core/services/customer.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable!: Table;
  @ViewChild('paginator') paginator!: Paginator;
  customers: Customer[] = [];
  totalRecordsCount: number = 0;
  pageSize: number = 30;
  pageNumber: number = 1;
  keySearch: string = '';
  currentPageReport: string = '';
  customer: Customer = new Customer();
  errorMessage!: string;
  showNameError: boolean = false;
  showNameError2: boolean = false;
  showNameError3: boolean = false;
  showNameError4: boolean = false;
  showNameError5: boolean = false;
  showNameError6: boolean = false;
  showDialog = false;
  showDialog2 = false;
  showDialog3 = false;
  messages: any[] = [];
  updateSuccess: boolean = false;
  customerById!: Customer;
  customerDelete!: Customer;
  checked: boolean = true;
  customerGroupId: number = 0;
  cusgroups: any[] = [];
  selectedCusGroups!: number;
  maxImages: number = 1;
  ingredient!: string;
  date: Date | undefined;
  customerForm!: FormGroup;
  customerForm2!: FormGroup;
  showFileSizeMessage: boolean = false;
  currentDate!: Date;
  isExist!: boolean;
  genderControl = new FormControl('');
  savingInProgress = false;
  genders = [
    { label: 'Nam', value: 'nam' },
    { label: 'Nữ', value: 'nữ' }
  ];
  isSubmitting: boolean = false;


  constructor(
    private customersService: CustomerService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.filterCustomers();
    this.FormGroupCustomers();
  }

  FormGroupCustomers() {
    this.customerForm = this.formBuilder.group({
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(101),
        ]),
      ],
      email: [null, [Validators.maxLength(254), this.validateEmail]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(03|05|07|08|09)[0-9]{8}$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      // customerGroupId: [null],
      gender: [null],
      dayOfBirth: [null, [this.dateOfBirthValidator]],
    });

    this.customerForm2 = this.formBuilder.group({
      id: [''],
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(101),
        ]),
      ],
      email: [null, [Validators.maxLength(254), this.validateEmail]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(03|05|07|08|09)[0-9]{8}$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      // customerGroupId: [null],
      gender: this.genderControl,
      dayOfBirth: [null, [this.dateOfBirthValidator]],
      version: [''],
      isDeleted: [''],
      // storeId: [''],
      // linkAvarta: [''],
      // base64_FileAvatar : ['']
    });
  }

  validateEmail(control: any) {
    const emailRegex =
      /^(?=.*[a-zA-Z])[\w.-]*[a-zA-Z][\w.-]*@[a-zA-Z\d-]+(\.[a-zA-Z]{2,4})+$/;
    if (control.value && !emailRegex.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }

  onKeyPress(event: KeyboardEvent) {
    const inputChar = event.key;
    if (!this.isNumberOrDecimalKey(inputChar, event.target!)) {
      event.preventDefault();
    }
  }

  isNumberOrDecimalKey(inputChar: string, inputElement: EventTarget): boolean {
    const input = (inputElement as HTMLInputElement).value;

    // Allow digits and one decimal point, but prevent more than one decimal point
    if (inputChar === '.' && input.includes('.')) {
      return false;
    }

    // Allow digits and decimal point
    return /^[0-9.]$/.test(inputChar);
  }

  dateOfBirthValidator(control: any) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();
    if (selectedDate > currentDate) {
      return { invalidDateOfBirth: true };
    }
    return null;
  }

  checkNameLength(): void {
    this.showNameError2 = false;
  }

  filterCustomers(): void {
    const options = {
      nameOrPhoneNumber: this.keySearch,
      customerGroupId: this.selectedCusGroups ? this.selectedCusGroups : null,
      pageIndex: this.pageNumber,
      pageSize: this.pageSize,
    };

    this.customersService.filterCustomers(options).subscribe(
      (response: any) => {
        if (response && response.data) {
          this.customers = response.data;
          this.totalRecordsCount = response.totalRecordsCount;
        } else {
          console.error('Invalid response format. Data property not found.');
        }
      },
      (error) => {
        console.error('Error filtering customers:', error);
      }
    );
  }

  onFilterClick(): void {
    this.filterCustomers();
  }

  openDialog() {
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.customerForm.reset();
    this.showNameError = false;
    this.showNameError2 = false;
    this.showNameError3 = false;
    this.showNameError4 = false;
  }

  openDialog2(customerId: number): void {
    this.customersService.getCustomerById(customerId).subscribe(
      (response: any) => {
        if (response.isSucceeded) {
          this.customerById = response.data;
          this.showDialog2 = true;
          console.log('data', this.customerById);

          const {
            id,
            name,
            email,
            phoneNumber,
            customerGroupId,
            gender,
            dayOfBirth,
            version,
            isDeleted,
            // storeId,
          } = this.customerById;

          const ngaySinh = dayOfBirth ? new Date(dayOfBirth) : null;

          this.customerForm2.patchValue({
            id,
            name,
            email,
            phoneNumber,
            customerGroupId,
            gender,
            dayOfBirth: ngaySinh,
            version,
            isDeleted,
            // storeId,
          });
        } else {
          console.error('Không thể lấy khách hàng theo ID:', response.message);
        }
      },
      (error) => {
        console.error('Lỗi:', error);
      }
    );
  }

  closeDialog2() {
    this.showDialog2 = false;
    this.customerForm2.reset();
    this.showNameError = false;
    this.showNameError2 = false;
    this.showNameError3 = false;
    this.showNameError4 = false;
  }

  onPageChange(event: any): void {
    this.pageSize = event.rows;
    this.pageNumber = event.page + 1;
    this.filterCustomers();
  }

  goToPreviousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.filterCustomers();
    }
  }

  goToNextPage(): void {
    const lastPage = Math.ceil(this.totalRecordsCount / this.pageSize);
    if (this.pageNumber < lastPage) {
      this.pageNumber++;
      this.filterCustomers();
    }
  }

  updateCurrentPageReport(): void {
    const startRecord = (this.pageNumber - 1) * this.pageSize + 1;
    const endRecord = Math.min(
      this.pageNumber * this.pageSize,
      this.totalRecordsCount
    );
    this.currentPageReport = `Hiện ${startRecord} tới ${endRecord} của ${this.totalRecordsCount} bản ghi`;
  }

  async onSubmit() {
    if (this.savingInProgress) {
      return;
    }

    this.isSubmitting = true;
    const formValues = this.customerForm.value;

    let hasError = false;

    if (!formValues.name || formValues.name.length === 0) {
      this.showNameError5 = true;
      hasError = true;
    }

    if (!formValues.phoneNumber || formValues.phoneNumber.length === 0) {
      this.showNameError6 = true;
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
      const response: any = await this.customersService
        .CheckCustomerExistence(this.customerForm.value.phoneNumber)
        .toPromise();

      if (
        response &&
        typeof response === 'object' &&
        response.data === true
      ) {
        this.showNameError2 = true;
      } else {
        if (this.customerForm.value.dayOfBirth !== null) {
          const dayOfBirth = new Date(this.customerForm.value.dayOfBirth);

          dayOfBirth.setHours(dayOfBirth.getHours() + 7);
          this.customerForm.patchValue({
            dayOfBirth: dayOfBirth.toISOString(),
          });
        }
        const createResponse = await this.customersService
          .createCustomer(this.customerForm.value)
          .toPromise();
        console.log('Customer created successfully!', createResponse);
        this.messages = [
          {
            severity: 'success',
            summary: 'Thành công',
            detail: 'Khách hàng đã được thêm thành công',
            life: 3000,
          },
        ];
        this.filterCustomers();
        this.closeDialog();
      }
    } catch (error) {
      console.error('Error:', error);
      this.messages = [
        {
          severity: 'error',
          summary: 'Thất bại',
          detail: 'Có lỗi xảy ra',
          life: 3000,
        },
      ];
      this.filterCustomers();
      this.closeDialog();
    } finally {
      this.savingInProgress = false;
    }

  }

  async onUpdateSubmit() {
    if (this.savingInProgress) {
      return;
    }


    try {
      this.savingInProgress = true;

      const response: any = await this.customersService
        .checkCustomerExistenceUpdate(
          this.customerForm2.value.phoneNumber,
          this.customerForm2.value.id
        )
        .toPromise();

      if (
        response &&
        typeof response === 'object' &&
        response.data === true
      ) {
        this.showNameError2 = true;
      } else {
        if (this.customerForm2.value.dayOfBirth !== null) {
          const dayOfBirth = new Date(this.customerForm2.value.dayOfBirth);

          dayOfBirth.setHours(dayOfBirth.getHours() + 7);

          this.customerForm2.patchValue({
            dayOfBirth: dayOfBirth.toISOString(),
          });
        }
        const updateResponse = await this.customersService
          .updateCustomer(this.customerForm2.value)
          .toPromise();
        this.messages = [
          {
            severity: 'success',
            summary: 'Thành công',
            detail: 'Khách hàng đã được cập nhật thành công',
            life: 3000,
          },
        ];
        this.filterCustomers();
        this.closeDialog2();
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.error.StatusCode === 4003) {
        this.messages = [
          {
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Phiên bản của bạn đã hết hạn',
            life: 3000,
          },
        ];
        setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        this.messages = [
          {
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Có lỗi xảy ra',
            life: 3000,
          },
        ];
      }
      this.filterCustomers();
      this.closeDialog2();
    } finally {
      this.savingInProgress = false;
    }
  }

  openDialog3(customer: number): void {
    this.customersService.getCustomerById(customer).subscribe(
      (response: any) => {
        if (response.isSucceeded) {
          this.customerDelete = response.data;
          this.showDialog3 = true;
          this.customerForm2.get('id')?.setValue(this.customerDelete.id);
          console.log('data', this.customerDelete);
        } else {
          console.error('Failed to get brand by ID:', response.message);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  closeDialog3() {
    this.showDialog3 = false;
    this.showNameError = false;
    this.showNameError2 = false;
    this.showNameError3 = false;
    this.showNameError4 = false;
  }

  deleteCustomer(id: any): void {
    this.customersService.deleteCustomer(id).subscribe(
      () => {
        console.log('Customer deleted successfully');
        this.messages = [
          {
            severity: 'success',
            summary: 'Thành công',
            detail: 'Xóa khách hàng thành công',
            life: 3000,
          },
        ];
        this.filterCustomers();
        this.closeDialog3();
      },
      (error) => {
        this.messages = [
          {
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Xóa hàng thất bại',
            life: 3000,
          },
        ];
        console.error('Error deleting customer:', error);
        this.closeDialog3();
      }
    );
  }
}
