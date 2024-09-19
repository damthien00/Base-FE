import { ActivateSuccessComponent } from './activate-success.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ActivateSuccessComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ActivateSuccessRoutingModule {}
