import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-stock-in',
    templateUrl: './stock-in.component.html',
    // styleUrls: ['./stock-in.component.css'],
})
export class StockInComponent implements OnInit {
    items: MenuItem[] | undefined;
    constructor() {}

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Nhập kho', route: '/inputtext' },
        ];
    }
}
