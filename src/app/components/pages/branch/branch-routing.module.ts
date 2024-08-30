import { BranchComponent } from './branch.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: BranchComponent }]),
    ],
    exports: [RouterModule],
})
export class BranchRoutingModule {}
