import { ActivateWarrantyComponent } from './activate-warranty.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ActivateWarrantyComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ActivateWarrantyRoutingModule {}
