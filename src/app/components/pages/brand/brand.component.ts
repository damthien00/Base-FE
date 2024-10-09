import { Component, OnInit, ViewChild } from '@angular/core';
import { Brand } from 'src/app/core/models/brands';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { BrandService } from 'src/app/core/services/brand.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrl: './brand.component.scss'
})
export class BrandComponent implements OnInit {
  @ViewChild('dataTable', { static: true }) dataTable!: Table;
  @ViewChild('paginator') paginator!: Paginator;
  brands!: any;
  totalRecordsCount: number = 0;
  pageSize: number = 30;
  pageNumber: number = 1;
  showDialog = false;
  checked: boolean = true;
  checked2: boolean = true;
  showDialog2 = false;
  currentPageReport: string = '';
  brand: Brand = new Brand();
  errorMessage!: string;
  showNameError: boolean = false;
  showNameError2: boolean = false;
  showNameError3: boolean = false;
  showNameError4: boolean = false;
  notify: any;
  messages: any[] = [];
  isChecked: boolean = false;
  brandbyId!: Brand;
  updateSuccess: boolean = false;
  loadingTableData: boolean = false;
  value: string | undefined;
  keySearch: string = '';
  savingInProgress = false;
  public userCurrent: any;
  items: MenuItem[] | undefined;

  private searchTermChanged: Subject<string> = new Subject<string>();

  constructor(
    private brandService: BrandService,
    private authService: AuthService,) {
    this.authService.userCurrent.subscribe((user) => {
      this.userCurrent = user;
    });
  }

  openDialog() {
    this.showDialog = true;
  }

  closeDialog(brandForm: NgForm) {
    this.showDialog = false;
    brandForm.reset();
    this.checked = true;
    this.showNameError = false;
    this.showNameError2 = false;
    this.showNameError3 = false;
    this.showNameError4 = false;
  }
  openDialog2(brandId: number): void {

    this.brandService.getBrandById(brandId).subscribe(
      (response: any) => {
        if (response.isSucceeded) {
          this.brandbyId = response.data;
          this.showDialog2 = true;
          console.log('brand', this.brandbyId)
        } else {
          console.error("Failed to get brand by ID:", response.message);
        }
      },
      error => {
        console.error("Error:", error);
      }
    );
  }

  closeDialog2(brandForm2:NgForm) {
    this.showDialog2 = false;
    brandForm2.reset();
    this.showNameError = false;
    this.showNameError2 = false;
    this.showNameError3 = false;
    this.showNameError4 = false;
  }

  ngOnInit(): void {
    this.items = [
      { icon: 'pi pi-home', route: '/installation' },
      { label: 'Danh mục thương hiệu' }
    ];
    this.searchTermChanged
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.getBrands();
      });
      this.getBrands();
  }
  onchangeforswitch() {
    console.log(this.brand.isDeleted);
  }
  onSearchTermChanged(newValue: string): void {
    this.searchTermChanged.next(newValue);
  }

  getBrands(): void {
    this.brandService.searchBrands(this.pageSize, this.pageNumber, this.keySearch.trim())
      .subscribe(
        (response: any) => {
          this.brands = response.data;
          this.totalRecordsCount = response.totalRecordsCount;
          this.updateCurrentPageReport();
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  onPageChange(event: any): void {
    this.pageSize = event.rows;
    this.pageNumber = event.page + 1;
    this.getBrands();
  }

  goToPreviousPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getBrands();
    }
  }

  goToNextPage(): void {
    const lastPage = Math.ceil(this.totalRecordsCount / this.pageSize);
    if (this.pageNumber < lastPage) {
      this.pageNumber++;
      this.getBrands();
    }
  }
  updateCurrentPageReport(): void {
    const startRecord = ((this.pageNumber - 1) * this.pageSize) + 1;
    const endRecord = Math.min(this.pageNumber * this.pageSize, this.totalRecordsCount);
    if(this.totalRecordsCount === 0){
      this.currentPageReport = `<strong>0</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecordsCount}</strong> bản ghi`
    }
    if(this.totalRecordsCount > 0){
      this.currentPageReport = `<strong>${startRecord}</strong> - <strong>${endRecord}</strong> trong <strong>${this.totalRecordsCount}</strong> bản ghi`
    }
  }

  checkDescriptionLength() {
    if (this.brand.description && this.brand.description.length > 500) {
      this.showNameError3 = true;
    } else {
      this.showNameError3 = false;
    }
  }
  checkNameLength(): void {
    const name = this.brand.name || '';
    const nameLength = name.length;

    this.showNameError2 = false;

    // Kiểm tra lỗi không bỏ trống hoặc có ít hơn 2 ký tự
    if (nameLength <= 1) {
      this.showNameError = true;
    } else {
      this.showNameError = false;
    }

    // Kiểm tra lỗi độ dài tên (dưới 3 hoặc trên 100 ký tự)
    if (nameLength > 100 || (nameLength < 3 && nameLength > 0)) {
      this.showNameError4 = true;
    } else {
      this.showNameError4 = false;
    }
  }

  async createBrand(brandForm: NgForm) {
    if (this.savingInProgress) {
      return;
    }
    if (brandForm.controls['name'].invalid || brandForm.controls['name'].value.trim() === "") {
      this.showNameError = true;
      return;
    } else {
      this.showNameError = false;
    }

    const trimmedName = this.brand.name.replace(/\s/g, '');
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
      this.showNameError4 = true;
      return;
    }

    if (this.brand.description && this.brand.description.length > 500) {
      this.showNameError3 = true;
      return;
    }

    let str = this.brand.name;
    str = str.trim().replace(/\s+/g, ' ');
    console.log(str);

    try {
      const isExist = await this.brandService.CheckBrandExistence(str).toPromise();
      if (isExist) {
        this.showNameError2 = true;
      } else {
        if (!this.checked) {
          this.brand.isDeleted = 1;
        } else {
          this.brand.isDeleted = 0;
        }

        const response = await this.brandService.createBrand(this.brand).toPromise();
        console.log('Thương hiệu được tạo thành công:', response);
        brandForm.reset();
        this.checked = true;
        this.closeDialog(brandForm);
        this.messages = [{
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thương hiệu đã được thêm thành công',
          life: 3000
        }];
        this.getBrands();

        this.showNameError = false;
        this.showNameError2 = false;
        this.showNameError3 = false;
        this.showNameError4 = false;
      }
    } catch (error) {
      this.errorMessage = 'Tạo thương hiệu thất bại. Vui lòng thử lại sau.';
      console.error('Đã xảy ra lỗi khi tạo thương hiệu:', error);
      this.closeDialog(brandForm);
      this.checked = true;
      this.messages = [{
        severity: 'error',
        summary: 'Thất bại',
        detail: 'Thêm thương hiệu thất bại',
        life: 3000
      }];
      this.showNameError = false;
      this.showNameError2 = false;
      this.showNameError3 = false;
      this.showNameError4 = false;
    } finally {
      this.savingInProgress = false;
    }
  }

  GetbyId(brandId: number): void {
    this.brandService.getBrandById(brandId).subscribe(brand => {
      this.brandbyId = brand;
      console.log('brand', this.brandbyId);
    });

  }

  checkDescriptionLength2() {
    if (this.brandbyId.description && this.brandbyId.description.length > 500) {
      this.showNameError3 = true;
    } else {
      this.showNameError3 = false;
    }
  }

  checkNameLength2(): void {
    const name = this.brandbyId.name || '';
    const nameLength = name.length;

    this.showNameError2 = false;
    // Kiểm tra lỗi không bỏ trống hoặc có ít hơn 2 ký tự
    if (nameLength <= 1) {
      this.showNameError = true;
    } else {
      this.showNameError = false;
    }

    // Kiểm tra lỗi độ dài tên (dưới 3 hoặc trên 100 ký tự)
    if (nameLength > 100 || (nameLength < 3 && nameLength > 0)) {
      this.showNameError4 = true;
    } else {
      this.showNameError4 = false;
    }
  }


  async updateBrand(brandForm2: NgForm): Promise<void> {
    if (this.savingInProgress) {
      // Nếu quá trình cập nhật thương hiệu đang diễn ra, không thực hiện hành động cập nhật mới.
      return;
    }

    let isValid = true;
    if (brandForm2.controls['name'].invalid || brandForm2.controls['name'].value.trim() === "") {
      this.showNameError = true;
      isValid = false;
    } else {
      this.showNameError = false;
    }

    const trimmedName = this.brandbyId.name.replace(/\s/g, '');
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 100) {
      this.showNameError4 = true;
      isValid = false;
    } else {
      this.showNameError4 = false;
    }

    if (this.brandbyId.description && this.brandbyId.description.length > 500) {
      this.showNameError3 = true;
      isValid = false;
    } else {
      this.showNameError3 = false;
    }

    if (!isValid) {
      return;
    }

    //this.brandbyId.version++;

    let str = this.brandbyId.name;
    str = str.trim().replace(/\s+/g, ' ');
    console.log(str);

    try {
      this.savingInProgress = true;

      const isExist = await this.brandService.checkBrandExistenceUpdate(str, this.brandbyId.id).toPromise();
      if (isExist) {
        this.showNameError2 = true;
      } else {
        if (this.brand.isDeleted !== 1) {
          this.brand.isDeleted = this.brand.isDeleted ? 0 : 1;
        }

        const response = await this.brandService.updateBrand(this.brandbyId).toPromise();
        console.log('Thương hiệu được cập nhật thành công:', response);

        brandForm2.reset();
        this.closeDialog2(brandForm2);
        this.messages = [{
          severity: 'success',
          summary: 'Thành công',
          detail: 'Thương hiệu đã được cập nhật thành công',
          life: 3000
        }];
        this.savingInProgress = false;
        this.getBrands();
        this.showNameError = false;
        this.showNameError2 = false;
        this.showNameError3 = false;
        this.showNameError4 = false;
      }
    } catch (error: any) {
      this.errorMessage = 'Cập nhật thương hiệu thất bại. Vui lòng thử lại sau.';
      console.error('Đã xảy ra lỗi khi cập nhật thương hiệu:', error);
      this.closeDialog2(brandForm2);
      if (error.error.StatusCode === 4003) {
        this.messages = [{
          severity: 'error',
          summary: 'Thất bại',
          detail: 'Phiên bản của bạn đã hết hạn',
          life: 3000
        }];
        setTimeout(() => {
          location.reload();
        }, 2000);
      } else {
        this.messages = [{
          severity: 'error',
          summary: 'Thất bại',
          detail: 'Có lỗi xảy ra',
          life: 3000
        }];
      }
      this.showNameError = false;
      this.showNameError2 = false;
      this.showNameError3 = false;
      this.showNameError4 = false;
    } finally {
      this.savingInProgress = false;
    }
  }


  // toggleBrandStatus(brandId: number): void {

  //   this.brandService.getBrandById(brandId).subscribe(brand => {

  //     brand.isDeleted = (brand.isDeleted === 0) ? 1 : 0;
  //     brand = {
  //       id: this.brand.id,
  //       isDeleted: this.brand.isDeleted
  //     }
  //     debugger
  //     console.log("brand", brand)

  //     this.brandService.updateBrand(brand).subscribe(
  //       response => {

  //         console.log("Brand updated successfully:", response);

  //         this.getBrands();
  //       },
  //       error => {

  //         console.error("Error updating brand:", error);
  //       }
  //     );
  //   });
  // }

  updateStatus(id: number, isDeleted: number): void {
    this.brandService.updateStatus(id, isDeleted)
      .subscribe(
        () => {
          console.log('Brand updated successfully', id, isDeleted);
          this.getBrands();
        },
        error => {
          console.error('Error updating brand:', error);
          this.getBrands();
        }
      );
  }
  reloadPage(): void {
    window.location.reload();
  }
}
