import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShowProductCategoryComponent } from './show-product-category.component';
import { AddProductCategoryModule } from '../add-product-category/add-product-category.module'; // Nhập module chứa AddProductCategoryComponent
import { EditProductCategoryModule } from '../edit-product-category/edit-product-category.module'; // Nhập module chứa EditProductCategoryComponent
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [
        [
            RouterModule.forChild([
                { path: '', component: ShowProductCategoryComponent },
            ]),
        ],
        AddProductCategoryModule, // Nhập module chứa AddProductCategoryComponent
        EditProductCategoryModule, // Nhập module chứa EditProductCategoryComponent
        SharedModule,
    ],
    declarations: [ShowProductCategoryComponent],
})
export class ShowProductCategoryModule {}
