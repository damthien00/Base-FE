import { NgModule } from '@angular/core';
import { ShowProductRoutingModule } from './show-routing.module';
import { ShowComponent } from './show.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { PaginatorModule } from 'primeng/paginator';

@NgModule({
    imports: [
        SharedModule, 
        ShowProductRoutingModule,
        PaginatorModule
    ],
    declarations: [ShowComponent],
})
export class ShowModule {}
