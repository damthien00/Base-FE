import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/modules/shared.module';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputSwitchModule } from 'primeng/inputswitch';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { SupplierRoutingModule } from './supplier-routing.module';
import { SupplierComponent } from './supplier.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SupplierRoutingModule,
    PaginatorModule,
    TableModule,
    SharedModule,
    TreeSelectModule,
    InputSwitchModule,
    MessagesModule,
    ToastModule,
    PaginatorModule,
    MultiSelectModule,
    EditorModule,
    CalendarModule
  ],
  declarations: [SupplierComponent],
})
export class SupplierModule { }
