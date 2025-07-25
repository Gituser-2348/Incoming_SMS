import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BulkpushComponent } from './bulkpush/bulkpush.component';
import { BroadcastRoutingModule } from './broadcasting-routing.module';
import { MaterialExampleModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TemplateComponent } from './template/template.component';



@NgModule({
  declarations: [
    BulkpushComponent,
    TemplateComponent
  ],
  imports: [
    CommonModule,
    BroadcastRoutingModule,
    MaterialExampleModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ]
})
export class BroadcastingModule { }
