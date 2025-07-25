import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MatIconModule } from '@angular/material/icon'
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { MaterialExampleModule } from '../material.module';
import { BrowserModule } from '@angular/platform-browser';
import { AppSharedModule } from '../../app-shared.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
  
   
    AppSharedModule,
    SharedModule, MatIconModule
  ],
  declarations: [
     DashboardComponent
    ]
})
export class DashboardModule { }
