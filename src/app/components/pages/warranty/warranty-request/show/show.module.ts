import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show.component';
import { ShowWarrantyRequestRoutingModule } from './show-routing.module';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, ShowWarrantyRequestRoutingModule, SharedModule],
    declarations: [ShowComponent],
})
export class ShowModule {}
