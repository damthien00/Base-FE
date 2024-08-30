import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockInComponent } from './stock-in.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { StockInRoutingModule } from './stock-in-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, StockInRoutingModule],
    declarations: [StockInComponent],
})
export class StockInModule {}
