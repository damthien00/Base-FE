import { WarrantyCertificateComponent } from './warranty-certificate.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: WarrantyCertificateComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class WarrantyCertificateRoutingModule {}
