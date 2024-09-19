import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';
import { OptionsFilterStockIn } from './../../../../../core/DTOs/stock-in/optionFilterStockIn';
import { StockInService } from './../../../../../core/services/stock-in.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { B } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'app-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.css'],
})
export class ShowComponent implements OnInit {
    imageUrl: string = environment.imageUrl;
    items: MenuItem[] | undefined;
    stockInList: any[];
    optionsFilterStockIn: OptionsFilterStockIn = new OptionsFilterStockIn();
    displayStockInDetailModal: boolean = false;

    stockInItemDetail: any;
    code: any;
    deadlineRange: Date[] = [];
    formatdate: string = 'dd/mm/yy';

    pageSize: number = 10;
    pageNumber: number = 1;
    totalRecordsCount: any;
    isLoading: boolean = true;

    constructor(private stockInService: StockInService) {}

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Nhập kho', route: '/inputtext' },
        ];
        this.loadStockIn();

        // this.deadlineRange = [
        //     this.optionsFilterStockIn.StartDate ?? new Date(),
        //     this.optionsFilterStockIn.EndDate ?? new Date(),
        // ];
    }

    loadStockIn() {
        this.isLoading = true;
        this.optionsFilterStockIn.pageIndex = this.pageNumber;
        this.optionsFilterStockIn.pageSize = this.pageSize;
        this.stockInService
            .getStockInLists(this.optionsFilterStockIn)
            .subscribe((response) => {
                this.totalRecordsCount = response.data.totalRecords;
                this.stockInList = response.data.items;
                console.log(this.totalRecordsCount);
            });
        this.isLoading = false;
    }

    showStockInDetail(stockIn: any) {
        console.log(stockIn);

        this.stockInService.getStockInById(stockIn.id).subscribe((response) => {
            this.stockInItemDetail = response.data;
        });
        this.displayStockInDetailModal = true;
    }

    blurDateRange($event: Event) {
        if (this.deadlineRange && this.deadlineRange.length === 2) {
            const [startDate, endDate] = this.deadlineRange;
            if (startDate) {
                startDate.setHours(startDate.getHours() + 7);
                this.optionsFilterStockIn.StartDate = startDate;
            }
            if (endDate) {
                endDate.setHours(endDate.getHours() + 7);
                this.optionsFilterStockIn.EndDate = endDate;
            }
        } else {
            this.optionsFilterStockIn.StartDate = undefined;
            this.optionsFilterStockIn.EndDate = undefined;
        }
    }

    EvenFilter() {
        if (this.deadlineRange) {
            this.optionsFilterStockIn.StartDate = this.deadlineRange[0] || null;
            this.optionsFilterStockIn.EndDate = this.deadlineRange[1] || null;
        } else {
            this.optionsFilterStockIn.StartDate = null;
            this.optionsFilterStockIn.EndDate = null;
        }
        this.pageNumber = 1;
        this.optionsFilterStockIn.Code = this.code;
        this.loadStockIn();
    }

    //Paganation
    onPageChange(event: any): void {
        console.log(event);

        this.pageSize = event.rows;
        this.pageNumber = event.page + 1;
        this.loadStockIn();
    }

    goToPreviousPage(): void {
        if (this.pageNumber > 1) {
            this.pageNumber--;
            this.loadStockIn();
        }
    }

    goToNextPage(): void {
        const lastPage = Math.ceil(this.totalRecordsCount / this.pageSize);
        if (this.pageNumber < lastPage) {
            this.pageNumber++;
            this.loadStockIn();
        }
    }
}
