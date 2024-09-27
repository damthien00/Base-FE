import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { OptionsFilterLading } from 'src/app/core/models/option-filter-lading';
import { BranchService } from 'src/app/core/services/branch.service';
import { MerchandiseService } from 'src/app/core/services/merchandise.service';

@Component({
    selector: 'app-stock-transfer',
    templateUrl: './stock-transfer.component.html',
    styleUrls: ['./stock-transfer.component.css'],
})
export class StockTransferComponent implements OnInit {
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
    branch: any[] = [];
    ladigns: any[] = [];
    currentPageReport: string = '';
    optionsFilterLadings: OptionsFilterLading = new OptionsFilterLading();

    constructor(
        private merchandiService: MerchandiseService,
        private branchService: BranchService
    ) { }

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Chuyển hàng', route: '/inputtext' },
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

    Filters(): void {
        //debugger
        this.merchandiService.getFilters(this.PageSize, this.PageIndex, this.FromBranchId, this.ToBranchId, this.FromBranchName, this.ToBranchName)
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

    clickButtonFilter() {
        if (this.selectedFromBranchName) {

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
