import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarrantyCertificateComponent } from './warranty-certificate.component';
import { WarrantyCertificateRoutingModule } from './warranty-certificate-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, SharedModule, WarrantyCertificateRoutingModule],
    declarations: [WarrantyCertificateComponent],
})
export class WarrantyCertificateModule {}
