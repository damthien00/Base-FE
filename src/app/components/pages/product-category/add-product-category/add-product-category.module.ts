import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { AddProductCategoryComponent } from './add-product-category.component';
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ReactiveFormsModule,
        ButtonModule,
        FormsModule,
        InputTextModule,
        InputTextareaModule,
        TreeSelectModule,
        // FormLayoutDemoRoutingModule,
    ],
    declarations: [AddProductCategoryComponent],
    exports: [AddProductCategoryComponent], // Xuất khẩu để sử dụng ở các module khác
})
export class AddProductCategoryModule {}
