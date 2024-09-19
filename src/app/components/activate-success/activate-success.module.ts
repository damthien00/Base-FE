import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivateSuccessComponent } from './activate-success.component';
import { ActivateSuccessRoutingModule } from './activate-success-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, ActivateSuccessRoutingModule, SharedModule],
    declarations: [ActivateSuccessComponent],
})
export class ActivateSuccessModule {}
