import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OptionsFilterCommodities } from 'src/app/core/models/option-filter-commodities';
import { RoleService } from 'src/app/core/services/role.service';
import { TreeNode } from 'primeng/api';
import { PermissionService } from 'src/app/core/services/permission.service';

@Component({
  selector: 'app-group-rights',
  templateUrl: './group-rights.component.html',
  styleUrl: './group-rights.component.scss'
})
export class GroupRightsComponent implements OnInit {
  permissionsById: any[] = [];
  permissionsById2: any[] = [];
  selectedPermissions: any[] = [];
  roles: any[] = [];
  pageIndex: number = 1;
  pageSize: number = 30;
  WordSearch: string = "";
  totalRecordsCount: number = 0;
  name: string = '';
  maxLength: number = 100;
  totalRecords: number = 0;
  groupRoleById!: any;
  groupRoleId: any;
  currentPageReport: string = '';
  selectedName!: string;
  showDialog = false;
  showDialog2 = false;
  messages!: any[];
  RoleGroupForm!: FormGroup;
  RoleGroupForm2!: FormGroup;
  savingInProgress = false;
  isSubmitting: boolean = false;
  showNameError: boolean = false;
  showNameError2: boolean = false;
  PageIndex: number = 1;
  PageSize: number = 30;
  PageIndex2: number = 1;
  PageSize2: number = 1000;
  showFullDescription: boolean = false;
  selectedPermissionIds: number[] = [];

  optionsFilterCommodities: OptionsFilterCommodities = new OptionsFilterCommodities();

  constructor(
    private router: Router,
    private roleService: RoleService,
    private permissionService: PermissionService,
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
      permissions: [[], Validators.required],
    });
    this.RoleGroupForm2 = this.fb.group({
      id: [''],
      name: ['', Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
        this.noWhitespaceValidator
      ])],
      description: ['', [Validators.required, this.noWhitespaceValidator]],
      permissions: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.Filters();
    this.getAllFilterRole();
    this.getAllFilterRole2();
  }

  noWhitespaceValidator(control: any) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  truncateDescription(description: string, limit: number, showFull: boolean): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    const plainText = doc.body.textContent || '';

    if (plainText.length > limit && !showFull) {
      return plainText.substring(0, limit) + '...';
    }
    return plainText;
  }


  getAllFilterRole(): void {
    this.permissionService.getPermissionAll(this.PageSize2, this.PageIndex2).subscribe((response: any) => {
      this.permissionsById = this.formatPermissions(response.data.items);
    });
  }

  getAllFilterRole2(): void {
    this.permissionService.getPermissionAll(this.PageSize2, this.PageIndex2).subscribe((response: any) => {
      const roles = response.data.items;
      this.permissionsById2 = [];
      roles.forEach((role: any) => {
        // Push the parent role without indentation
        this.permissionsById.push({
          label: role.displayName,
          value: role.id,
          level: 0 // Level for parent
        });
        // Recursively flatten and add the child roles
        this.flattenChildrens(role.childrens, 1); // Start with level 1 for children
      });
    });
  }
  
  private flattenChildrens(childrens: any[], level: number): void {
    if (!childrens || childrens.length === 0) return;
    childrens.forEach(child => {
      // Push the child role with a specified level
      this.permissionsById2.push({
        label: child.displayName,
        value: child.id,
        level: level // Set the level for children
      });
      // Recursively process deeper child roles
      this.flattenChildrens(child.childrens, level + 1);
    });
  }
  
  
  
  formatPermissions(items: any[]): any[] {
    return items.map(item => {
      return {
        label: item.displayName,
        data: item.name,
        id: item.id,
        children: this.formatPermissions(item.childrens)
      };
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

  toggleDescription(role: any): void {
    role.showFullDescription = !role.showFullDescription;
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

  openDialog2(Id: number): void {
    this.groupRoleId = Id;
    this.getAllFilterRole2();
    this.roleService.getGroupRoleById(Id).subscribe(
      (response: any) => {
        this.groupRoleById = response.data;
        const selectedPermissionIds = this.groupRoleById.permissions.map(permission => permission.id);
        this.showDialog2 = true;
        this.RoleGroupForm2.patchValue({
          id: this.groupRoleById.id,
          name: this.groupRoleById.name,
          description: this.groupRoleById.description,
          permissions: selectedPermissionIds
        });
      },
      error => {
        console.error("Error:", error);
      }
    );
  }

  get rolesControl() {
    return this.RoleGroupForm.get('permissionIds');
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

  closeDialog2() {
    this.showDialog2 = false;
    this.RoleGroupForm2.reset();
    this.showNameError = false;
    this.showNameError2 = false;
  }

  onInputChange(event: any) {
    const input = event.target;
    let trimmedValue = input.value.trim();

    if (trimmedValue.length > this.maxLength) {
      input.value = trimmedValue.substring(0, this.maxLength);
    }
  }

  getErrorMessage() {
    if (this.RoleGroupForm.controls['name'].hasError('required')) {
      return 'Tên nhóm quyền không được để trống';
    }
    return 'Tên nhóm quyền không được chứa toàn ký tự trắng';
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

    // if (!formValues.description || formValues.description.length === 0) {
    //   this.showNameError2 = true;
    //   hasError = true;
    // }


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

      const selectedPermissions = this.RoleGroupForm.value.permissionIds.map((item: any) => item.id);

      const roleData = {
        name: formValues.name,
        description: formValues.description,
        permissionIds: selectedPermissions // Lấy tên của các nhóm quyền
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
