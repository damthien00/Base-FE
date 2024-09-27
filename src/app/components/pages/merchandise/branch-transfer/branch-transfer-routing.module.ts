import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BranchTransferComponent } from './branch-transfer.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: '', component: BranchTransferComponent }]),
  ],
  exports: [RouterModule],
})
export class BranchTransferRoutingModule { }
