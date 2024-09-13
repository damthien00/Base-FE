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
    // optionsFilterStockIn: new OptionsFilterStockIn();
    constructor(private stockInService: StockInService) {}

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Nhập kho', route: '/inputtext' },
        ];
        this.loadStockIn();
    }

    loadStockIn() {
        this.stockInService
            .getStockInLists(this.optionsFilterStockIn)
            .subscribe((response) => {
                this.stockInList = response.data.items; // In ra dữ liệu để kiểm tra
            });
    }

    showStockInDetail(stockIn: any) {
        console.log(stockIn);
        this.displayStockInDetailModal = true;
        this.stockInItemDetail = stockIn.inventoryStockInDetails;
    }
}
