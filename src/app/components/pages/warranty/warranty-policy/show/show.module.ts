import { ShowWarrantyPolicyRoutingModule } from './show-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { CreateModule } from '../create/create.module';
import { EditModule } from '../edit/edit.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        ShowWarrantyPolicyRoutingModule,
        CreateModule,
        EditModule,
    ],
    declarations: [ShowComponent],
})
export class ShowModule {}
