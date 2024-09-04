import { ShowComponent } from './show.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: ShowComponent }])],
    exports: [RouterModule],
})
export class ShowWarrantyPolicyRoutingModule {}
