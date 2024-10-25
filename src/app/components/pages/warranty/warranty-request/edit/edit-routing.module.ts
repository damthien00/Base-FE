import { EditComponent } from './edit.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: EditComponent }])],
    exports: [RouterModule],
})
export class EditRoutingModule {}
