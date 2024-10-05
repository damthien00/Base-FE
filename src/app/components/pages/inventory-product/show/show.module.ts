import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ShowProductRoutingModule } from './show-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, ShowProductRoutingModule],
    declarations: [ShowComponent],
})
export class ShowModule {}
