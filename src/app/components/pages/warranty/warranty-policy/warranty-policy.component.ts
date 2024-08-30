import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-warranty-policy',
    templateUrl: './warranty-policy.component.html',
    styleUrls: ['./warranty-policy.component.css'],
})
export class WarrantyPolicyComponent implements OnInit {
    items: MenuItem[] | undefined;
    constructor() {}

    ngOnInit() {
        this.items = [
            { label: 'Bảo hành' },
            { label: 'Chính sách bảo hành', route: '/inputtext' },
        ];
    }
}
