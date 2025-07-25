
import { ReportRoutingModule } from './report-routing.module';

import { NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
// import { DaterangePickerComponent } from '../../shared/components/daterange-picker/daterange-picker.component';
import { MaterialModule } from '../../material.module';
import { AgGridModule } from 'ag-grid-angular';

//import { MaterialExampleModule } from '../material.module';
import { DetailedComponent } from './detailed/detailed.component';
import { SummaryComponent } from './summary/summary.component';


import { VMNListComponent } from './vmnlist/vmnlist.component';
//import { VmnlistComponent } from '../end-user/reports/vmnlist/vmnlist.component';
import { MatSortModule } from "@angular/material/sort";



import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { NgxSpinnerModule } from 'ngx-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';

import { MatTabGroup } from '@angular/material/tabs';

import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";

import { MatStepperModule } from "@angular/material/stepper";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";

import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

import { MatNativeDateModule } from "@angular/material/core";

import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSliderModule } from "@angular/material/slider";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppSharedModule } from '../../app-shared.module';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  declarations: [
    // DaterangePickerComponent,
    DetailedComponent,
    SummaryComponent,
  //  ConfigComponent,
   // ChatreportComponent,
   // ChatHistoryComponent,
    // NgxtForDirective,
   // AgentReportComponent,
   // PmmwComponent,
    VMNListComponent, //VmnlistComponent
    // DaterangePickerComponent
  ],
  imports: [
    CommonModule, MatInputModule, MatTableModule,
    ReportRoutingModule,
    FormsModule,
    NgbDatepickerModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    AppSharedModule,
    SharedModule,
    MatSortModule, MatProgressSpinnerModule
  ],
   providers: [DatePipe], // Provide DatePipe
})
export class ReportModule { }
