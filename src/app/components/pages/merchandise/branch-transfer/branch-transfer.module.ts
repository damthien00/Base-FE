import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { NumberFormatPipe } from 'src/app/shared/pipes/numberFormat.pipe';
import { BranchTransferComponent } from './branch-transfer.component';
import { BranchTransferRoutingModule } from './branch-transfer-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, BranchTransferRoutingModule],
  declarations: [BranchTransferComponent, NumberFormatPipe],
})
export class BranchTransferModule { }
