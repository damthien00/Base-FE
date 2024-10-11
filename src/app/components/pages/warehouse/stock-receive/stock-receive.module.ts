import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { StockReceiveRoutingModule } from './stock-receive-routing.module';
import { StockReceiveComponent } from './stock-receive.component';


@NgModule({
  imports: [CommonModule, SharedModule, StockReceiveRoutingModule, PaginatorModule, TableModule],
  declarations: [StockReceiveComponent],
})
export class StockReceiveModule { }
