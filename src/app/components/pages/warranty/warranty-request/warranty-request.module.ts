import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarrantyRequestComponent } from './warranty-request.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { WarrantyCertificateRoutingModule } from '../warranty-certificate/warranty-certificate-routing.module';
import { WarrantyRequestRoutingModule } from './warranty-request-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, WarrantyRequestRoutingModule],
    declarations: [WarrantyRequestComponent],
})
export class WarrantyRequestModule {}
