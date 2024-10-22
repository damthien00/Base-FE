import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryBranchComponent } from './inventory-branch.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: InventoryBranchComponent }])],
    exports: [RouterModule],
})
export class ShowProductRoutingModule {}
