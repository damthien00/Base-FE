import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OptionsFilterLading } from 'src/app/core/models/option-filter-lading';
import { AuthService } from 'src/app/core/services/auth.service';
import { BranchService } from 'src/app/core/services/branch.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';
import { DatePipe } from '@angular/common';
import { BillOfLadingService } from 'src/app/core/services/bill-of-lading.service';
import html2pdf from 'html2pdf.js';


@Component({
    selector: 'app-stock-transfer',
    templateUrl: './stock-transfer.component.html',
    styleUrls: ['./stock-transfer.component.css'],
    providers: [DatePipe]

})
export class StockTransferComponent implements OnInit {
    @ViewChild('transferNote') transferNote!: ElementRef;
    items: MenuItem[] | undefined;
    PageIndex: number = 1;
    PageSize: number = 30;
    FromBranchId!: number;
    ToBranchId!: number;
    FromBranchName!: string;
    ToBranchName!: string;
    totalRecords: number = 0;
    selectedBranch: any;
    selectedFromBranchName!: string;
    selectedCode!: string;
    selectedCreatedAt!: string;
    selectedBranchId!: number;
    selectedIAccepted: { label: string; value: string } | null = null;
    Code!: string;
    CreatedAt!: string;
    IAccepted!: string;
    branch: any[] = [];
    ladigns: any[] = [];
    formatdate: string = "dd/mm/yy";
    currentPageReport: string = '';
    public userCurrent: any;
    selectedUsers: any;
    selectedBillOfLading: any;
    hideTransferNote = true;
    selectedUserData: any = null;
    selectedLadings: any[] = [];
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
        private billOfLadingService: BillOfLadingService,
        private datePipe: DatePipe
    ) {
        this.authService.userCurrent.subscribe((user) => {
            this.userCurrent = user;
        });
    }

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Chuyển hàng', route: '/inputtext' },
        ];
        this.Filters();
        this.loadWarrantyPolicies();
    }

    onCheckboxChange(user: any, event: any) {
        if (event.checked) {
            this.selectedLadings.push(user); // Thêm vào danh sách đã chọn
        } else {
            const index = this.selectedLadings.findIndex(l => l.id === user.id);
            if (index !== -1) {
                this.selectedLadings.splice(index, 1); // Xóa khỏi danh sách đã chọn
            }
        }
    }


    groupAndSumProducts(products) {
        const groupedProducts = [];

        products.forEach(product => {
            // Kiểm tra xem sản phẩm với cùng productId và productVariantId đã tồn tại trong nhóm chưa
            const existingProduct = groupedProducts.find(p => p.productId === product.productId && p.productVariantId === product.productVariantId);

            if (existingProduct) {
                // Nếu đã tồn tại, tăng số lượng lên 1 và nối frameNumber/engineNumber
                existingProduct.quantity += 1;
                existingProduct.codes.push(product.code);  // Thêm frameNumber vào danh sách
                // existingProduct.engineNumbers.push(product.engineNumber); // Thêm engineNumber vào danh sách
            } else {
                // Nếu chưa tồn tại, thêm sản phẩm mới vào nhóm với số lượng ban đầu là 1 và frameNumber/engineNumber ban đầu
                groupedProducts.push({
                    ...product,
                    quantity: 1,
                    codes: [product.code],
                    // engineNumbers: [product.engineNumber] // Tạo danh sách engineNumber
                });
            }
        });

        return groupedProducts;
    }

    showTransferNoteForLading(lading: any) {
        document.getElementById("transferNote").style.display = 'block';

        // Cập nhật nội dung mã phiếu
        const transferCodeElement = document.querySelector(".transfer-code p") as HTMLElement;
        if (transferCodeElement) {
            transferCodeElement.innerText = `Mã Phiếu chuyển: ${lading.code}`;
        }

        // Cập nhật thông tin chi nhánh chuyển
        const fromBranchNameElement = document.querySelector(".from-branch-name") as HTMLElement;
        const fromBranchPhoneElement = document.querySelector(".from-branch-phone") as HTMLElement;
        const fromBranchAddressElement = document.querySelector(".from-branch-address") as HTMLElement;
        const exportDateElement = document.querySelector(".export-date") as HTMLElement;

        if (fromBranchNameElement) {
            fromBranchNameElement.innerText = lading.fromBranchName; // Cập nhật tên chi nhánh chuyển
        }
        if (fromBranchPhoneElement) {
            fromBranchPhoneElement.innerText = lading.phoneNumber; // Giả sử bạn có trường này trong lading
        }
        if (fromBranchAddressElement) {
            fromBranchAddressElement.innerText = lading.address; // Giả sử bạn có trường này trong lading
        }
        if (exportDateElement) {
            exportDateElement.innerText = new Date(lading.createdAt).toLocaleDateString(); // Cập nhật ngày xuất, bạn có thể định dạng lại nếu cần
        }

        // Tương tự cho chi nhánh nhận
        const toBranchNameElement = document.querySelector(".to-branch-name") as HTMLElement;
        const toBranchPhoneElement = document.querySelector(".to-branch-phone") as HTMLElement;
        const toBranchAddressElement = document.querySelector(".to-branch-address") as HTMLElement;

        if (toBranchNameElement) {
            toBranchNameElement.innerText = lading.toBranchName; // Cập nhật tên chi nhánh nhận
        }
        if (toBranchPhoneElement) {
            toBranchPhoneElement.innerText = lading.toBranchPhone; // Giả sử bạn có trường này trong lading
        }
        if (toBranchAddressElement) {
            toBranchAddressElement.innerText = lading.toBranchAddress; // Giả sử bạn có trường này trong lading
        }

        const groupedProducts = this.groupAndSumProducts(lading.productCodes);

        // Cập nhật danh sách đơn hàng
        const tbody = document.querySelector(".orders-table tbody");
        tbody.innerHTML = ''; // Xóa dữ liệu cũ
        groupedProducts.forEach((product, index) => {
            const row = `<tr>
                  <td>${index + 1}</td>
                  <td>${product.productName || ''} ${`-` + product.productVariantName || ''}</td>
                  <td>${product.codes.join(", ")}</td>
                  <td style="text-align: center;">${product.unitName || ''}</td>
                  <td style="text-align: center;">${product.quantity || ''}</td>
                </tr>`;
            tbody.innerHTML += row;
        });
    }

    // Xuất PDF
    async generatePDF() {
        for (const lading of this.selectedLadings) {
            // Hiển thị nội dung phiếu chuyển cho mỗi lading
            this.showTransferNoteForLading(lading);

            const element = document.getElementById('transferNote');
            const options = {
                margin: 1,
                filename: `phieu_chuyen_kho_${lading.code}.pdf`, // Tên file theo mã phiếu
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
            };

            // Xuất PDF
            await html2pdf().from(element).set(options).save();
        }
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
        this.merchandiService.getFilters(this.PageSize, this.PageIndex, this.FromBranchId = this.userCurrent?.branchId, this.ToBranchId, this.FromBranchName, this.ToBranchName, this.Code, this.IAccepted, this.CreatedAt)
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
                return 'Chuyển thành công';
            case 'reject':
                return 'Hủy chuyển hàng';
            default:
                return 'Trạng thái không xác định';
        }
    }


    getStatusLabel(statusValue: string): string {
        const status = this.statuses.find((s) => s.value === statusValue);
        return status ? status.label : 'Trạng thái không xác định';
    }

    clickButtonFilter() {
        if (this.selectedCode && this.CreatedAt) {
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
        // this.Filters();
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
