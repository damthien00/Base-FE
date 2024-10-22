import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { BranchTransferComponent } from './branch-transfer.component';
import { BranchTransferRoutingModule } from './branch-transfer-routing.module';
import { NumberFormatPipe2 } from 'src/app/shared/pipes/numberFormat2.pipe';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  imports: [CommonModule, SharedModule, BranchTransferRoutingModule, MultiSelectModule],
  declarations: [BranchTransferComponent, NumberFormatPipe2],
})
export class BranchTransferModule {}
