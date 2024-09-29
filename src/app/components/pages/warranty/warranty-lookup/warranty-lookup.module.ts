import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { WarrantyLookupRoutingModule } from './warranty-lookup-routing.module';
import { WarrantyLookupComponent } from './warranty-lookup.component';

@NgModule({
  imports: [CommonModule, SharedModule, WarrantyLookupRoutingModule],
  declarations: [WarrantyLookupComponent]
})
export class WarrantyLookupModule { }
