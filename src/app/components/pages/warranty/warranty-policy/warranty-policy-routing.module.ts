import { WarrantyPolicyComponent } from './warranty-policy.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: WarrantyPolicyComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class WarrantyPolicyRoutingModule {}
