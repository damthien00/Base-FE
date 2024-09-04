import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { CreateRoutingModule } from './show-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { NumberFormatPipe } from 'src/app/shared/pipes/numberFormat.pipe';

@NgModule({
    imports: [CommonModule, SharedModule, CreateRoutingModule],
    declarations: [CreateComponent, NumberFormatPipe],
})
export class CreateModule {}
