import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateProductRoutingModule } from './create-routing.module';
import { CreateComponent } from './create.component';
import { FileUploadModule } from 'primeng/fileupload';

import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ChipsModule } from 'primeng/chips';
import { InputSwitchModule } from 'primeng/inputswitch';

@NgModule({
    imports: [
        CreateProductRoutingModule,
        SharedModule,
        ChipsModule,
        InputSwitchModule,
        FileUploadModule,
        ReactiveFormsModule,
        FormsModule,
    ],
    declarations: [CreateComponent],
})
export class CreateModule {}
