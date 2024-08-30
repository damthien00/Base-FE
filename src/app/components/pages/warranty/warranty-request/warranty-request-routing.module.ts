import { WarrantyRequestComponent } from './warranty-request.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: WarrantyRequestComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class WarrantyRequestRoutingModule {}
