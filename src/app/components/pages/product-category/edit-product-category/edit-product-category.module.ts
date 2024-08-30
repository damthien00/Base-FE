import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { EditProductCategoryComponent } from './edit-product-category.component';
@NgModule({
    imports: [CommonModule, DialogModule, ButtonModule],
    declarations: [EditProductCategoryComponent],
    exports: [EditProductCategoryComponent], // Xuất khẩu nếu cần sử dụng ở module khác
})
export class EditProductCategoryModule {}
