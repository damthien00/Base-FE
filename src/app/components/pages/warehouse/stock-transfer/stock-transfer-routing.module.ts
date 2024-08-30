import { StockTransferComponent } from './stock-transfer.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: StockTransferComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class StockTransferRoutingModule {}
