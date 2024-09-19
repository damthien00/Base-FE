import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarrantyMbComponent } from './warranty-mb.component';
import { WarrantyMbRoutingModule } from './warranty-mb-routing.module';

@NgModule({
    imports: [CommonModule, WarrantyMbRoutingModule],
    declarations: [WarrantyMbComponent],
})
export class WarrantyMbModule {}
