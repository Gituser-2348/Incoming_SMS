import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FlowbuilderRoutingModule } from './flowbuilder-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material.module';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule} from '@angular/common/http';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';


import { FlowlandingComponent } from './flowlanding/flowlanding.component';
import { FlowBuilderComponent } from './flowbuilder.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DropDownComponent } from './sidebar/dropdownComponent/dropdown.component';
import { BotResponseComponent } from './sidebar/Components/botComponent/bot.component';
import { TriggerComponent } from './sidebar/Components/triggerComponent/trigger.component';
import { LogisticsComponent } from './sidebar/Components/logisticsComponent/logistics.component';
import { OperationsComponent } from './sidebar/Components/operationComponent/operations.components';
import { PropertyComponent } from './propertybuilder/propertybuilder.component';
import { WpbotasksComponent } from './propertybuilder/propertyComponents/wpBotAsks/wpbotasks.component';
import { WpbotsaysComponent } from './propertybuilder/propertyComponents/wpBotSays/wpbotsays.component';
import { WebhookComponent } from './propertybuilder/propertyComponents/webhook/webhook.component';
import { ConditionsComponent } from './propertybuilder/propertyComponents/conditions/conditions.component';
import { NextObjectComponent } from './shared/nextObject/next-object.component';
import { FreeTextValidatorComponent } from '../../shared/components/free-text-validator/free-text-validator.component';
import { FlowPreviewComponent } from './flowPreview/flowPreview.component';
import { HelpWindowComponent } from './shared/help-window/help-window.component';
import { PrettyPrintPipe } from './pretty-print.pipe';
import { ApiTestComponent } from './propertybuilder/propertyComponents/webhook/apiTestComponent/apiTest.component';
import { LiveAgentsComponent } from './propertybuilder/propertyComponents/live-agents/live-agents.component';
import { AppSharedModule } from '../../app-shared.module';




@NgModule({
  declarations: [
    FlowlandingComponent,
    FlowBuilderComponent,
    SidebarComponent,
    DropDownComponent,
    BotResponseComponent,
    TriggerComponent,
    LogisticsComponent,
    OperationsComponent,
    PropertyComponent,
    WpbotasksComponent,
    WpbotsaysComponent,
    WebhookComponent,
    ConditionsComponent,
    NextObjectComponent,
    FreeTextValidatorComponent,
    FlowPreviewComponent,
    HelpWindowComponent,
    PrettyPrintPipe,
    ApiTestComponent,
    LiveAgentsComponent,
  ],
  imports: [
    AppSharedModule,
    CommonModule,
    FlowbuilderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    NgxSpinnerModule,
    HttpClientModule,
    LoadingBarHttpClientModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class FlowbuilderModule { }
