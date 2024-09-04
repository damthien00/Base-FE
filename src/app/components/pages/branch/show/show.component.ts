import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';

@Component({
    selector: 'app-show',
    templateUrl: './show.component.html',
    styleUrls: ['./show.component.css'],
})
export class ShowComponent implements OnInit {
    @ViewChild('createModal') createModal!: CreateComponent;
    @ViewChild('editModal') editModal!: EditComponent;
    items: MenuItem[] | undefined;
    constructor() {}

    ngOnInit() {
        this.items = [{ label: 'Danh sách chi nhánh' }];
    }
    onBranchCreated(newBranch: any): void {
        // this.categories.push(newBranch);
    }
    onBranchUpdated(updatedBranch: any): void {
        // const index = this.categories.findIndex(
        //     (category) => category.id === updatedCategory.id
        // );
        // if (index !== -1) {
        //     this.categories[index] = updatedCategory;
        // }
    }

    openCreateModal(): void {
        console.log(1);
        this.createModal.showModalDialog();
    }

    // openEditModal(category: any): void {
    //     // this.editModal.categoryId = category.id;
    //     this.editModal.showModalDialog();
    // }
}
