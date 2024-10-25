import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
    items: MenuItem[] | undefined;
    constructor() {}

    ngOnInit() {
        this.items = [
            { label: 'Kho hàng' },
            { label: 'Bảo hành', route: '/inputtext' },
            { label: 'Cập nhật yêu cầu bảo hành', route: '/inputtext' },
        ];
    }
}
