import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryBranchComponent } from './inventory-branch.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ShowProductRoutingModule } from './inventory-branch-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ShowProductRoutingModule
  ],
  declarations: [InventoryBranchComponent]
})
export class InventoryBranchModule { }
