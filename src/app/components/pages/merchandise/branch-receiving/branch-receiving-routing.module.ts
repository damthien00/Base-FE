import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchReceivingComponent } from './branch-receiving.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: BranchReceivingComponent }]),
  ],
  exports: [RouterModule],
})
export class BranchReceivingRoutingModule { }
