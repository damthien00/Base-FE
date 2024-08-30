import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchComponent } from './branch.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { BranchRoutingModule } from './branch-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, BranchRoutingModule],
    declarations: [BranchComponent],
})
export class BranchModule {}
