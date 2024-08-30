import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockTransferComponent } from './stock-transfer.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { StockTransferRoutingModule } from './stock-transfer-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, StockTransferRoutingModule],
    declarations: [StockTransferComponent],
})
export class StockTransferModule {}
