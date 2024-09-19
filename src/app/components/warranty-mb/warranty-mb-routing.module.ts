import { WarrantyMbComponent } from './warranty-mb.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: WarrantyMbComponent }]),
    ],
    exports: [RouterModule],
})
export class WarrantyMbRoutingModule {}
