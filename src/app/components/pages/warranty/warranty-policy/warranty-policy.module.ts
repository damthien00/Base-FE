import { WarrantyPolicyRoutingModule } from './warranty-policy-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarrantyPolicyComponent } from './warranty-policy.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, SharedModule, WarrantyPolicyRoutingModule],
    declarations: [WarrantyPolicyComponent],
})
export class WarrantyPolicyModule {}
