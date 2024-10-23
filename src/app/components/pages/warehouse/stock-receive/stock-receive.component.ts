import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OptionsFilterLading } from 'src/app/core/models/option-filter-lading';
import { AuthService } from 'src/app/core/services/auth.service';
import { BranchService } from 'src/app/core/services/branch.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-stock-receive',
  templateUrl: './stock-receive.component.html',
  styleUrl: './stock-receive.component.scss',
  providers: [DatePipe]
})
export class StockReceiveComponent implements OnInit {
  items: MenuItem[] | undefined;
  PageIndex: number = 1;
  PageSize: number = 30;
  FromBranchId!: number;
  ToBranchId!: number;
  FromBranchName!: string;
  CreatedAt!: string;
  ToBranchName!: string;
  totalRecords: number = 0;
  selectedBranch: any;
  selectedFromBranchName!: string;
  selectedCode!: string;
  selectedBranchId!: number;
  selectedIAccepted: { label: string; value: string } | null = null;
  Code!: string;
  IAccepted!: string;
  branch: any[] = [];
  ladigns: any[] = [];
  formatdate: string = "dd/mm/yy";
  currentPageReport: string = '';
  public userCurrent: any;
  statuses = [
    { label: 'Đang chuyển', value: 'waiting' },
    { label: 'Chuyển thành công', value: 'accept' },
    { label: 'Hủy chuyển hàng', value: 'reject' }
  ];
  optionsFilterLadings: OptionsFilterLading = new OptionsFilterLading();

  constructor(
    private merchandiService: MerchandiseService,
    private branchService: BranchService,
    private authService: AuthService,
    private datePipe: DatePipe
  ) {
    this.authService.userCurrent.subscribe((user) => {
      this.userCurrent = user;
    });
  }

  ngOnInit() {
    this.items = [
      { label: 'Kho hàng' },
      { label: 'Nhận hàng', route: '/inputtext' },
    ];
    this.Filters();
    this.loadWarrantyPolicies();
  }

  loadWarrantyPolicies() {
    this.branchService.getBranchsAll().subscribe((response: any) => {
      this.branch = response.data.items.map((option: any) => {
        return {
          ...option,
          shortenedName: this.shortenName(option.name, 30) // Giới hạn độ dài tên
        };
      });
    });
  }

  shortenName(name: string, maxLength: number): string {
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + '...'; // Cắt ngắn và thêm ...
    }
    return name;
  }

  onDateSelect(event: any) {
    // Định dạng ngày theo ý muốn, ví dụ "YYYY-MM-DD" (có thể dùng moment.js hoặc DatePipe của Angular)
    this.CreatedAt = this.formatDateToString(event);
  }

  // Ví dụ sử dụng DatePipe của Angular để định dạng ngày:
  formatDateToString(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); // Sử dụng DatePipe
  }

  onDateClear() {
    this.CreatedAt = null; // Xóa dữ liệu trong this.CreatedAt
  }


  Filters(): void {
    //debugger
    this.merchandiService.getFilters(this.PageSize, this.PageIndex, this.FromBranchId, this.ToBranchId = this.userCurrent?.branchId, this.FromBranchName, this.ToBranchName, this.Code, this.IAccepted)
      .subscribe(
        response => {
          this.ladigns = response.data.items;
          this.totalRecords = response.data.totalRecords;
          this.updateCurrentPageReport();
          //console.log(this.users)
        },
        error => {
          console.error('Error fetching filtered customers:', error);
        }
      );
  }

  getStatus(iAccepted: string): string {
    switch (iAccepted) {
      case 'waiting':
        return 'Đang chuyển hàng';
      case 'accept':
        return 'Nhận hàng thành công';
      case 'reject':
        return 'Đã hủy nhận hàng';
      default:
        return 'Trạng thái không xác định';
    }
  }

  getStatusLabel(statusValue: string): string {
    const status = this.statuses.find((s) => s.value === statusValue);
    return status ? status.label : 'Trạng thái không xác định';
  }

  clickButtonFilter() {
    if (this.selectedCode) {
      this.Code = this.selectedCode.trim();
      this.ToBranchId = this.selectedBranchId;
      this.IAccepted = this.selectedIAccepted?.value || null;
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
      this.Code = this.selectedCode?.trim();
      this.ToBranchId = this.selectedBranchId;
      this.IAccepted = this.selectedIAccepted?.value || null;
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
