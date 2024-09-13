import { OptionsFilterProduct } from 'src/app/core/models/options-filter-product';
import { OptionsFilterStockIn } from './../../../../../core/DTOs/stock-in/optionFilterStockIn';
import { StockInService } from './../../../../../core/services/stock-in.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.css'],
})
export class ShowComponent implements OnInit {
    items: MenuItem[] | undefined;
    stockInList: any;
    optionsFilterStockIn: OptionsFilterStockIn = new OptionsFilterStockIn();
    displayStockInDetailModal: boolean = false;

    stockInItemDetail: any;
    deadlineRange: Date[] = [];
    formatdate: string = 'dd/mm/yy';
    constructor(private stockInService: StockInService) {}

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Nhập kho', route: '/inputtext' },
        ];
        this.loadStockIn();

        this.deadlineRange = [
            this.optionsFilterStockIn.StartDate ?? new Date(),
            this.optionsFilterStockIn.EndDate ?? new Date(),
        ];
    }

    loadStockIn() {
        console.log(this.optionsFilterStockIn);
        this.stockInService
            .getStockInLists(this.optionsFilterStockIn)
            .subscribe((response) => {
                this.stockInList = response.data.items; // In ra dữ liệu để kiểm tra
            });
    }

    showStockInDetail(stockIn: any) {
        console.log(stockIn);
        this.displayStockInDetailModal = true;
        this.stockInItemDetail = stockIn;
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
        this.loadStockIn();
    }
}
