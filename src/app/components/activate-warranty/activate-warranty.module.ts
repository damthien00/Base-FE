import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivateWarrantyComponent } from './activate-warranty.component';
import { ActivateWarrantyRoutingModule } from './activate-warranty-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, ActivateWarrantyRoutingModule, SharedModule],
    declarations: [ActivateWarrantyComponent],
})
export class ActivateWarrantyModule {}
