import { MyModuleComponent } from './my-module.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: MyModuleComponent }]),
    ],
    exports: [RouterModule],
})
export class MyModuleRoutingModule {}
