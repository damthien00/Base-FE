import { Component, OnInit, ViewChild } from '@angular/core';
import { AddProductCategoryComponent } from '../add-product-category/add-product-category.component';
import { EditProductCategoryComponent } from '../edit-product-category/edit-product-category.component';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/categories';
import { MenuItem } from 'primeng/api';
@Component({
    selector: 'app-show-product-category',
    templateUrl: './show-product-category.component.html',
    styleUrls: ['./show-product-category.component.css'],
})
export class ShowProductCategoryComponent implements OnInit {
    categories: Category[] = [];
    // selectedProducts: Product[] = [];
    cols: any[] = [];
    items: MenuItem[] | undefined;

    @ViewChild('createModal') createModal!: AddProductCategoryComponent;
    @ViewChild('editModal') editModal!: EditProductCategoryComponent;

    constructor(private categoryService: CategoryService) {}

    ngOnInit(): void {
        this.loadCategories();
        this.cols = [
            { field: 'product', header: 'Product' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' },
        ];
        this.items = [
            { icon: 'pi pi-home', route: '/installation' },
            { label: 'Components' },
            { label: 'Form' },
            { label: 'InputText', route: '/inputtext' },
        ];
    }

    loadCategories(): void {
        this.categoryService.getCategoryAll().subscribe((data) => {
            this.categories = data.data;
        });
    }

    onCategoryCreated(newCategory: Category): void {
        this.categories.push(newCategory);
    }

    onCategoryUpdated(updatedCategory: Category): void {
        const index = this.categories.findIndex(
            (category) => category.id === updatedCategory.id
        );
        if (index !== -1) {
            this.categories[index] = updatedCategory;
        }
    }

    openCreateModal(): void {
        this.createModal.showModalDialog();
    }

    openEditModal(category: Category): void {
        this.editModal.categoryId = category.id;
        this.editModal.showModalDialog();
    }
}
