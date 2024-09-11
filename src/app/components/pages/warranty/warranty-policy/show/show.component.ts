import { WarrantyPolicyService } from './../../../../../core/services/warranty-policy.service';
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
    warrantyPolicies: any;
    constructor(private warrantyPolicyService: WarrantyPolicyService) {}
    ngOnInit() {
        this.items = [
            { label: 'Bảo hành' },
            { label: 'Chính sách bảo hành', route: '/inputtext' },
        ];
        this.loadWarrantyPolicies();
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

    openEditModal(warrantyPolicy: any): void {
        console.log(warrantyPolicy);
        this.editModal.showModalDialog(warrantyPolicy);
    }

    loadWarrantyPolicies() {
        this.warrantyPolicyService.getWarrantyPolicies().subscribe((data) => {
            this.warrantyPolicies = data.data.items;
        });
    }
}
