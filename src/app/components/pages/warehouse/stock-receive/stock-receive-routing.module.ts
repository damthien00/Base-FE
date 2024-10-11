import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StockReceiveComponent } from './stock-receive.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: StockReceiveComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class StockReceiveRoutingModule { }
