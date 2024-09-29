import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WarrantyLookupComponent } from './warranty-lookup.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: WarrantyLookupComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class WarrantyLookupRoutingModule { }
