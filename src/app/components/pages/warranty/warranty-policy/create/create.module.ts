import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create.component';
import { SharedModule } from 'src/app/shared/modules/shared.module';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [CreateComponent],
    exports: [CreateComponent],
})
export class CreateModule {}
