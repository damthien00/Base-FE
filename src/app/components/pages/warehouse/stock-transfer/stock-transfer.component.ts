import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-stock-transfer',
    templateUrl: './stock-transfer.component.html',
    styleUrls: ['./stock-transfer.component.css'],
})
export class StockTransferComponent implements OnInit {
    items: MenuItem[] | undefined;
    constructor() {}

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Chuyển hàng', route: '/inputtext' },
        ];
    }
}
