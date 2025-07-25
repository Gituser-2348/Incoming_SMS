import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EndUserRoutingModule } from '../end-user-routing/end-user-routing.module';
import { ReportsComponent } from '../reports/reports.component';
import { DetailedreportComponent } from '../reports/detailedreport/detailedreport.component';
import { SummaryreportComponent } from '../reports/summaryreport/summaryreport.component';
import { VmnlistComponent } from '../reports/vmnlist/vmnlist.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../../material.module';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AppSharedModule } from '../../../app-shared.module';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [ReportsComponent, DetailedreportComponent, SummaryreportComponent, VmnlistComponent
  ],
  imports: [
    FormsModule,
    EndUserRoutingModule,
    CommonModule, 
    NgbDatepickerModule,
    MaterialModule,
    AgGridModule,
    
    HttpClientModule,
    MatNativeDateModule,

    ReactiveFormsModule,
    NgxSpinnerModule,
    AppSharedModule,
    SharedModule
  ],
    providers: [DatePipe],
})
export class EndUserModule { }
