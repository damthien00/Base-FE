import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { ShowRoutingModule } from './show-routing.module';
import { CreateModule } from '../create/create.module';

@NgModule({
    imports: [CommonModule, SharedModule, ShowRoutingModule, CreateModule],
    declarations: [ShowComponent],
})
export class ShowModule {}
