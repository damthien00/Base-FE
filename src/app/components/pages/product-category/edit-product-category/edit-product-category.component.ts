import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/categories';

@Component({
    selector: 'app-edit-product-category',
    templateUrl: './edit-product-category.component.html',
})
export class EditProductCategoryComponent implements OnInit {
    @Input() categoryId!: number;
    category: Category = {
        id: 0,
        name: '',
    };

    @Output() categoryUpdated = new EventEmitter<Category>();

    displayModal: boolean = false;

    constructor(private categoryService: CategoryService) {}

    ngOnInit(): void {
        if (this.categoryId) {
            this.categoryService
                .getCategoryById(this.categoryId)
                .subscribe((data) => {
                    this.category = data;
                });
        }
    }

    showModalDialog(): void {
        this.displayModal = true;
    }

    onSubmit(): void {
        this.categoryService
            .updateCategory(this.category)
            .subscribe((updatedCategory) => {
                this.categoryUpdated.emit(updatedCategory);
                this.displayModal = false;
            });
    }
}
