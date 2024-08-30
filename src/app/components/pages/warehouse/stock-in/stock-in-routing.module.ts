import { StockInComponent } from './stock-in.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: StockInComponent }]),
    ],
    exports: [RouterModule],
})
export class StockInRoutingModule {}
