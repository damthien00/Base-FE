import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryCompanyComponent } from './inventory-company.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: InventoryCompanyComponent }])],
    exports: [RouterModule],
})
export class InventroryCompanyRoutingModule {}
