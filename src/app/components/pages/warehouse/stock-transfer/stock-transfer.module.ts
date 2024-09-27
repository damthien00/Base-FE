import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockTransferComponent } from './stock-transfer.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { StockTransferRoutingModule } from './stock-transfer-routing.module';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';

@NgModule({
    imports: [CommonModule, SharedModule, StockTransferRoutingModule, PaginatorModule, TableModule],
    declarations: [StockTransferComponent],
})
export class StockTransferModule {}
