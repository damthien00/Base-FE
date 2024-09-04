import { CreateComponent } from './create.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: CreateComponent }]),
    ],
    exports: [RouterModule],
})
export class CreateRoutingModule {}
