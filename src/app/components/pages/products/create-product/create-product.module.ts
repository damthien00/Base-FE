import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';

import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CreateProductRoutingModule } from './create-product-routing.module';
import { CreateProductComponent } from './create-product.component';
import { CheckboxModule } from 'primeng/checkbox';
import { EditorModule } from 'primeng/editor';
import { ButtonModule } from 'primeng/button';

@NgModule({
  imports: [
    CreateProductRoutingModule,
    SharedModule,
    ChipsModule,
    InputSwitchModule,
    FileUploadModule,
    ReactiveFormsModule,
    CheckboxModule,
    FormsModule,
    EditorModule,
    CommonModule,
    ButtonModule
  ],
  declarations: [CreateProductComponent]
})
export class CreateProductModule { }


