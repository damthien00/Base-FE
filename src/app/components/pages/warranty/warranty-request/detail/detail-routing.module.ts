import { DetailComponent } from './detail.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: DetailComponent }]),
    ],
    exports: [RouterModule],
})
export class DetailRoutingModule {}
