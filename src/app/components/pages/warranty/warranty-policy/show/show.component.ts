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
        this.items = [
            { label: 'Bảo hành' },
            { label: 'Chính sách bảo hành', route: '/inputtext' },
        ];
    }

    onWarrantPolicyCreated(newWarrantPolicy: any): void {
        // this.categories.push(newWarrantPolicy);
    }

    onWarrantPolicyUpdated(updatedWarrantPolicy: any): void {
        // const index = this.categories.findIndex(
        //     (category) => category.id === updatedCategory.id
        // );
        // if (index !== -1) {
        //     this.categories[index] = updatedCategory;
        // }
    }

    openCreateModal(): void {
        this.createModal.showModalDialog();
    }

    openEditModal(category: any): void {
        // this.editModal.categoryId = category.id;
        this.editModal.showModalDialog();
    }
}
