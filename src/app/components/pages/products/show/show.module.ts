import { NgModule } from '@angular/core';
import { ShowProductRoutingModule } from './show-routing.module';
import { ShowComponent } from './show.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [SharedModule, ShowProductRoutingModule],
    declarations: [ShowComponent],
})
export class ShowModule {}
