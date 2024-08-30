import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-branch',
    templateUrl: './branch.component.html',
    styleUrls: ['./branch.component.css'],
})
export class BranchComponent implements OnInit {
    items: MenuItem[] | undefined;
    constructor() {}

    ngOnInit() {
        this.items = [{ label: 'Danh sách chi nhánh' }];
    }
}
