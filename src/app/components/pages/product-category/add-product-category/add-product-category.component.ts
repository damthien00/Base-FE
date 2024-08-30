import { OnInit } from '@angular/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { CategoryService } from 'src/app/core/services/category.service';
import { Category } from 'src/app/core/models/categories';
import { OptionsFilterProduct } from 'src/app/core/models/product-test';
import { NodeService } from 'src/app/core/services/node.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from 'src/app/core/utils/validation.utils';
@Component({
    selector: 'app-add-product-category',
    templateUrl: './add-product-category.component.html',
    styleUrls: ['./add-product-category.component.css'],
})
export class AddProductCategoryComponent implements OnInit {
    category: Category = {
        id: 0,
        name: '',
    };
    @Output() categoryCreated = new EventEmitter<Category>();
    optionsFillerProduct: OptionsFilterProduct = new OptionsFilterProduct();
    displayModal: boolean = false;
    nodes!: any[];
    selectedNodes: any;
    treeCategory: any[] = [];
    createProductCategoryForm: FormGroup;

    constructor(
        // injector: Injector,
        private categoryService: CategoryService,
        private nodeService: NodeService,
        private formBuilder: FormBuilder,
        private validationService: ValidationService
    ) {
        //  super(injector);
        this.nodeService.getFiles().then((files) => (this.nodes = files));
        this.createProductCategoryForm = this.formBuilder.group({
            name: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(101),
                ]),
            ],
        });
    }
    async ngOnInit() {
        let responseGetTreeCategory =
            await this.categoryService.getTreeCategory();
        // this.loading = false;
        console.log(responseGetTreeCategory);
        this.treeCategory = responseGetTreeCategory.data;
    }

    showModalDialog(): void {
        this.displayModal = true;
    }

    onSubmit(): void {
        this.categoryService
            .createCategory(this.category)
            .subscribe((newCategory) => {
                this.categoryCreated.emit(newCategory);
                this.displayModal = false;
            });
    }

    onClear() {
        this.optionsFillerProduct.CategoryId = null;
        let label = document.querySelector(
            '.category-select .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = 'Chọn danh mục';
        }
    }

    onNodeSelect(event: any) {
        console.log(event);
        this.optionsFillerProduct.CategoryId = this.selectedNodes?.id;
        let label = document.querySelector(
            '.category-select .p-treeselect-label'
        );
        if (label) {
            label.innerHTML = this.selectedNodes?.name || '';
        }
    }
}
