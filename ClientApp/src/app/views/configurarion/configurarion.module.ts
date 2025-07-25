import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddparameterComponent } from './url/addparameter/addparameter.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NewrequestComponent } from './request/newrequest/newrequest.component';
import { ConfigurationRoutingModule } from './configuration.routing.module';
import { MatTabGroup } from '@angular/material/tabs';
import { InfoComponent } from './info/info.component';
import { NumbersComponent } from './numbers/numbers.component';
import { RequestComponent } from './request/request.component';
import { UrlComponent } from './url/url.component';
import { WebuserComponent } from './webuser/webuser.component';
import { MatTooltipModule } from '@angular/material/tooltip'
import { ConfigurarionComponent } from './configurarion.component';

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
import { ViewaccountdetailsComponent } from './webuser/viewaccountdetails/viewaccountdetails.component';


@NgModule({
  declarations: [
    AddparameterComponent,
  
    NewrequestComponent,
    InfoComponent, NumbersComponent, RequestComponent, UrlComponent, WebuserComponent, ConfigurarionComponent, ViewaccountdetailsComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule, FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    AppSharedModule,
    MatNativeDateModule,
    MatPaginatorModule,
    SharedModule,
    MatTooltipModule,
    
    
    
  
    NgxSpinnerModule,
   
   
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,

    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,

    MatGridListModule,
    MatIconModule,
    MatInputModule,
   
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
  
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
  
    MatTableModule,
    MatTabsModule,

   
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]

})
export class ConfigurarionModule { }
