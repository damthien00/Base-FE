import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyModuleComponent } from './my-module.component';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        [RouterModule.forChild([{ path: '', component: MyModuleComponent }])],
        CommonModule,
    ],
    declarations: [MyModuleComponent],
})
export class MyModuleModule {}
