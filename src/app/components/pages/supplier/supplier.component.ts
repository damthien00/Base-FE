import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Paginator } from 'primeng/paginator';
import { ConfirmationService } from 'primeng/api';
import { FormGroup, NgForm } from '@angular/forms';
import { Table } from 'primeng/table';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Supplier } from 'src/app/core/models/suppliers';
import { SupplierService } from 'src/app/core/services/supplier.service';


@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.scss'
})
export class SupplierComponent implements OnInit {
  //Supplier
  suppliers: any[] = [];
  supplierbyId!: Supplier;
  value: string | undefined;
  keySearch: string = '';
  supplier: Supplier = new Supplier();

  //Interface
  @ViewChild('dataTable', { static: true }) dataTable!: Table;
  @ViewChild('paginator') paginator!: Paginator;
  totalRecordsCount: number = 0;
  pageSize: number = 30;
  pageNumber: number = 1;
  savingInProgress = false;

  showCreateDialog = false;
  showUpdateDialog = false;

  //Validate
  isChecked: boolean = false;
  checked: boolean = true;
  checked2: boolean = true;
  currentPageReport: string = '';
  errorMessage!: string;
  showNameErrorEmpty: boolean = false;

  //Notify
  notify: any;
  messages: any[] = [];
  updateSuccess: boolean = false;
  contentDeleteDialog: any;

  //Event
  showDeleteDialog: boolean = false;
  private searchTermChanged: Subject<string> = new Subject<string>();
  supplierForm = new FormGroup({});

  constructor(private supplierService: SupplierService) {
  }

  ngOnInit(): void {
    this.searchTermChanged
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        this.getSuppliers();
      });
    this.getSuppliers();
  }

  //Validate
  validateNumber(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  validateSupplierForm(form: NgForm): boolean {
    const nameControl = form.controls['name'];
    const phoneControl = form.controls['phone'];
    const emailControl = form.controls['email'];
    const taxCodeControl = form.controls['taxCode'];
    const addressControl = form.controls['address'];
    let isValid = true; // Mặc định là form hợp lệ

    // Kiểm tra và xử lý lỗi cho tên nhà cung cấp
    if (nameControl) {
      if (nameControl.errors?.['required']) {
        console.error('Tên nhà cung cấp không được bỏ trống');
        isValid = false;
      }
      if (
        nameControl.errors?.['minlength'] ||
        nameControl.errors?.['maxlength']
      ) {
        console.error('Tên nhà cung cấp phải từ 3 đến 100 ký tự');
        isValid = false;
      }
    }

    // Kiểm tra và xử lý lỗi cho số điện thoại
    if (phoneControl) {
      if (phoneControl.errors?.['required']) {
        console.error('Số điện thoại không được bỏ trống');
        isValid = false;
      }
      if (
        phoneControl.errors?.['minlength'] ||
        phoneControl.errors?.['maxlength']
      ) {
        console.error('Số điện thoại phải có đúng 10 chữ số');
        isValid = false;
      }
      if (phoneControl.errors?.['pattern']) {
        console.error('Số điện thoại không hợp lệ');
        isValid = false;
      }
    }

    // Kiểm tra và xử lý lỗi cho email
    if (emailControl) {
      if (emailControl.errors?.['required']) {
        console.error('Email không được bỏ trống');
        isValid = false;
      }
      if (emailControl.errors?.['pattern']) {
        console.error('Nhập sai định dạng email');
        isValid = false;
      }
    }

    // Kiểm tra và xử lý lỗi cho mã số thuế
    if (taxCodeControl) {
      if (taxCodeControl.errors?.['required']) {
        console.error('Mã số thuế không được bỏ trống');
        isValid = false;
      }
      if (taxCodeControl.errors?.['pattern']) {
        console.error('Mã số thuế chỉ được chứa từ 10 đến 13 chữ số');
        isValid = false;
      }
    }

    // Kiểm tra và xử lý lỗi cho địa chỉ
    if (addressControl) {
      if (addressControl.errors?.['required']) {
        console.error('Địa chỉ không được bỏ trống');
        isValid = false;
      }
      if (addressControl.errors?.['maxlength']) {
        console.error('Địa chỉ không được vượt quá 255 ký tự');
        isValid = false;
      }
    }
    return isValid;
  }

  //Handle Dialog
  openCreateDialog() {
    this.showCreateDialog = true;
  }

  closeCreateDialog(brandForm: NgForm) {
    this.showCreateDialog = false;
    brandForm.reset();
    this.checked = true;
    this.showNameErrorEmpty = false;
  }

  openUpdateDialog(supplierId: number): void {
    this.supplierService.getSupplierById(supplierId).subscribe(
      (response: any) => {
        if (response.isSucceeded) {
          this.supplierbyId = response.data;
          this.showUpdateDialog = true;
        } else {
          console.error('Failed to get brand by ID:', response.message);
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  closeUpdateDialog(brandForm2: NgForm) {
    this.showUpdateDialog = false;
    brandForm2.reset();
    this.showNameErrorEmpty = false;
  }

  onSearchTermChanged(newValue: string): void {
    this.searchTermChanged.next(newValue);
  }

  //Call API
  getSuppliers(): void {
    this.supplierService
      .FilterSuppliers(this.pageSize, this.pageNumber, this.keySearch.trim())
      .subscribe(
        (response: any) => {
          this.suppliers = response.data;
          this.totalRecordsCount = response.totalRecordsCount;
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  deleteSupplier(id: any): void {
    this.supplierService.deleteSupplier(id).subscribe(
      () => {
        this.messages = [
          {
            severity: 'success',
            summary: 'Thành công',
            detail: 'Xóa nhà cung cấp thành công',
            life: 3000,
          },
        ];
        this.getSuppliers();
        this.showDeleteDialog = false;
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
      }
    );
  }

  async updateSupplier(brandForm2: NgForm): Promise<void> {
    let str = this.supplierbyId.name;
    str = str.trim().replace(/\s+/g, ' ');
    if (this.validateSupplierForm(brandForm2)) {
      try {
        this.savingInProgress = true;
        if (this.supplier.isDeleted !== 1) {
          this.supplier.isDeleted = this.supplier.isDeleted ? 0 : 1;
        }
        const response = await this.supplierService
          .updateSupplier(this.supplierbyId)
          .toPromise();
        brandForm2.reset();
        this.closeUpdateDialog(brandForm2);
        this.messages = [
          {
            severity: 'success',
            summary: 'Thành công',
            detail: 'Nhà cung cấp đã được cập nhật thành công',
            life: 3000,
          },
        ];
        this.savingInProgress = false;
        this.getSuppliers();
      } catch (error) {
        this.errorMessage =
          'Cập nhật nhà cung cấp thất bại. Vui lòng thử lại sau.';
        console.error('Đã xảy ra lỗi khi cập nhật nhà cung cấp:', error);
        this.closeUpdateDialog(brandForm2);
        this.messages = [
          {
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Cập nhật nhà cung cấp thất bại',
            life: 3000,
          },
        ];
        this.showNameErrorEmpty = false;
      } finally {
        this.savingInProgress = false;
      }
    }
  }

  openDeleteDialog(event: Event, id: any) {
    this.showDeleteDialog = true;
    this.GetbyId(id);
  }

  async createSupplier(supplierForm: NgForm) {
    let str = this.supplier.name;
    str = str.trim().replace(/\s+/g, ' ');
    if (this.validateSupplierForm(supplierForm)) {
      try {
        if (!this.checked) {
          this.supplier.isDeleted = 1;
        } else {
          this.supplier.isDeleted = 0;
        }
        const response = await this.supplierService
          .createSupplier(this.supplier)
          .toPromise();
        supplierForm.reset();
        this.checked = true;
        this.closeCreateDialog(supplierForm);
        this.messages = [
          {
            severity: 'success',
            summary: 'Thành công',
            detail: 'nhà cung cấp đã được thêm thành công',
            life: 3000,
          },
        ];
        this.getSuppliers();
      } catch (error) {
        this.errorMessage = 'Tạo nhà cung cấp thất bại. Vui lòng thử lại sau.';
        console.error('Đã xảy ra lỗi khi tạo nhà cung cấp:', error);
        this.closeCreateDialog(supplierForm);
        this.checked = true;
        this.messages = [
          {
            severity: 'error',
            summary: 'Thất bại',
            detail: 'Thêm nhà cung cấp thất bại',
            life: 3000,
          },
        ];
      } finally {
        this.savingInProgress = false;
      }
    }
  }

  //Paganation
  onPageChange(event: any): void {
    this.pageSize = event.rows;
    this.pageNumber = event.page + 1;
    this.getSuppliers();
  }

  goToPreviousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getSuppliers();
    }
  }

  goToNextPage(): void {
    const lastPage = Math.ceil(this.totalRecordsCount / this.pageSize);
    if (this.pageNumber < lastPage) {
      this.pageNumber++;
      this.getSuppliers();
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

  GetbyId(supplierId: number): void {
    this.supplierService.getSupplierById(supplierId).subscribe((supplier) => {
      this.supplierbyId = supplier.data;
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}
