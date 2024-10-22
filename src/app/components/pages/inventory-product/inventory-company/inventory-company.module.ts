import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryCompanyComponent } from './inventory-company.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { InventroryCompanyRoutingModule } from './inventory-company-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InventroryCompanyRoutingModule
  ],
  declarations: [InventoryCompanyComponent]
})
export class InventoryCompanyModule { }
