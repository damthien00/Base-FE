import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OptionsFilterCommodities } from 'src/app/core/models/option-filter-commodities';
import { RoleService } from 'src/app/core/services/role.service';

@Component({
  selector: 'app-group-rights',
  templateUrl: './group-rights.component.html',
  styleUrl: './group-rights.component.scss'
})
export class GroupRightsComponent implements OnInit {
  Roles: any[] = [];
  roles: any[] = [];
  pageIndex: number = 1;
  pageSize: number = 30;
  WordSearch: string = "";
  totalRecordsCount: number = 0;
  name: string = '';
  totalRecords: number = 0;
  currentPageReport: string = '';
  selectedName!: string;
  showDialog = false;
  showDialog2 = false;
  messages!: any[];
  RoleGroupForm!: FormGroup;
  savingInProgress = false;
  isSubmitting: boolean = false;
  showNameError: boolean = false;
  showNameError2: boolean = false;

  optionsFilterCommodities: OptionsFilterCommodities = new OptionsFilterCommodities();

  constructor(
    private router: Router,
    private roleService: RoleService,
    private fb: FormBuilder
  ) {

    this.RoleGroupForm = this.fb.group({
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        this.noWhitespaceValidator
      ])],
      description: ['', [Validators.required, this.noWhitespaceValidator]],
      permissionIds: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.Filters();
    this.getAllFilterRole();
  }

  noWhitespaceValidator(control: any) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  getAllFilterRole(): void {
    this.roleService.getRoleAll().subscribe((response: any) => {
      this.Roles = response.data.items;
    });
  }

  Filters(): void {
    //debugger
    this.roleService.getFiltersRoles(this.pageSize, this.pageIndex, this.name)
      .subscribe(
        response => {
          this.roles = response.data.items;
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
      this.name = this.selectedName?.trim();
      this.pageIndex = 1;
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
      this.name = this.selectedName?.trim();
      this.pageIndex = 1;
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

  onPageChange(event: any): void {
    this.pageIndex = event.page + 1;
    this.pageSize = event.rows;
    this.Filters();
  }

  goToPreviousPage(): void {
    if (this.pageIndex > 1) {
      this.pageIndex--;
      this.Filters();
    }
  }

  goToNextPage(): void {
    const lastPage = Math.ceil(this.totalRecords / this.pageSize);
    if (this.pageIndex < lastPage) {
      this.pageIndex++;
      this.Filters();
    }
  }
  updateCurrentPageReport(): void {
    const startRecord = (this.pageIndex - 1) * this.pageIndex + 1;
    const endRecord = Math.min(
      this.pageIndex * this.pageSize,
      this.totalRecords
    );
    this.currentPageReport = `<strong>${startRecord}</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecords}</strong> bản ghi`;
  }

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.trim(); // Cắt ký tự khoảng trắng ở hai đầu chuỗi
    this.optionsFilterCommodities.name = trimmedValue;
  }

  openDialog() {
    // this.showDialog = true;
    this.showDialog = true;
  }

  get rolesControl() {
    return this.RoleGroupForm.get('roles');
  }

  // get rolesControl2() {
  //   return this.RoleGroupForm2.get('roles');
  // }

  checkRolesSelection() {
    // Kiểm tra nếu trường chưa có giá trị
    if (!this.rolesControl?.value || this.rolesControl.value.length === 0) {
      this.rolesControl.setErrors({ required: true }); // Đặt lỗi required
      this.rolesControl.markAsTouched(); // Đánh dấu trường là touched
    } else {
      this.rolesControl.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
    }
  }

  // checkRolesSelection2() {
  //   // Kiểm tra nếu trường chưa có giá trị
  //   if (!this.rolesControl2?.value || this.rolesControl2.value.length === 0) {
  //     this.rolesControl2.setErrors({ required: true }); // Đặt lỗi required
  //     this.rolesControl2.markAsTouched(); // Đánh dấu trường là touched
  //   } else {
  //     this.rolesControl2.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
  //   }
  // }

  closeDialog() {
    this.showDialog = false;
    this.RoleGroupForm.reset();
    this.showNameError = false;
    this.showNameError2 = false;
  }

  async onSubmit() {
    if (this.savingInProgress) {
      return;
    }

    this.isSubmitting = true;
    const formValues = this.RoleGroupForm.value;

    let hasError = false;

    if (!this.rolesControl?.value || this.rolesControl.value.length === 0) {
      this.rolesControl.setErrors({ required: true }); // Đặt lỗi required
      this.rolesControl.markAsTouched(); // Đánh dấu trường là touched
      hasError = true;
    } else {
      this.rolesControl.setErrors(null); // Xóa lỗi nếu đã chọn giá trị
    }


    if (!formValues.name || formValues.name.length === 0) {
      this.showNameError = true;
      hasError = true;
    }

    if (!formValues.description || formValues.description.length === 0) {
      this.showNameError2 = true;
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

      const roleData = {
        name: formValues.name,
        description: formValues.description,
        permissionId: formValues.permissionIds.map(permissionId => permissionId.id) // Lấy tên của các nhóm quyền
      };

      // Gửi yêu cầu tới API để thêm người dùng
      this.roleService.createRoles(roleData).subscribe(response => {
        console.log('Nhóm quyền đã được tạo thành công', response);
        this.messages = [{
          severity: 'success',
          summary: 'Thành công',
          detail: 'Nhóm quyền đã được thêm thành công',
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
}
