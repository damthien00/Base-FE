import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { BranchReceivingRoutingModule } from './branch-receiving-routing.module';
import { BranchReceivingComponent } from './branch-receiving.component';
import { NumberFormatPipe3 } from 'src/app/shared/pipes/numberFormat3.pipe';

@NgModule({
  imports: [CommonModule, SharedModule, BranchReceivingRoutingModule],
  declarations: [BranchReceivingComponent, NumberFormatPipe3],
})
export class BranchReceivingModule { }
