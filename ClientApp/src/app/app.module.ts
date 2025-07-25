import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { AppComponent } from './app.component';


// Import containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { SignInComponent } from './views/sign-in/sign-in.component';
import { RegisterComponent } from './views/register/register.component';


const APP_CONTAINERS = [
  DefaultLayoutComponent
];

import {
  AppAsideModule,
  AppBreadcrumbModule,
  AppHeaderModule,
  AppFooterModule,
  AppSidebarModule,
} from '@coreui/angular';

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ChartsModule } from 'ng2-charts';
//import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { EncryptDecryptAuth } from './core/interceptors/EncryptDecryptAuth.interceptor';
import { ErrorIntercept } from './core/interceptors/error.interceptor';
import { LoaderInterceptor } from './core/interceptors/loader-interceptor.service';
import { ToastrModule } from 'ngx-toastr';
import { AppConfig } from './core/AppConfig/app.config';
import { BnNgIdleService } from 'bn-ng-idle';
import { ManageAccServiceModule } from './core/manage-acc-service/manage-acc-service.module';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RegiformComponent } from './shared/components/regiform/regiform.component';
import { VerificationComponent } from './shared/components/verification/verification.component';
import { AgGridModule } from 'ag-grid-angular';
import { ChatBotComponent } from './shared/components/chat-bot/chat-bot.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AppSharedModule } from './app-shared.module';
import { NgxtForDirective } from './views/report/chatHisotry/ngxt-for.directive';



export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

@NgModule({
  imports: [
    PickerModule, 
    //SweetAlert2Module.forRoot(),
    NgxIntlTelInputModule,
    MatTooltipModule,
    BrowserModule,
    AgGridModule.withComponents([]),
  /*  AgGridModule,*/
    //  ReportRoutingModule,
    
    AppSharedModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    IconModule,
    MatIconModule,
    HttpClientModule,
    //NgbModule,
    //NgbModule.forRoot(),
    //MatDialogModule,
    ManageAccServiceModule,
    IconSetModule.forRoot(),
    BackButtonDisableModule.forRoot({
      preserveScrollPosition: true
    }),
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      closeButton: true,
    }),
    FormsModule,
    ReactiveFormsModule,
    EmojiModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    CommonModule
  ],
  declarations: [
    // NgxtForDirective,
    // ChatBotComponent,
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    SignInComponent,
    RegisterComponent,
    RegiformComponent,
    VerificationComponent,

  ],
  providers: [
    {
      // provide:BnNgIdleService,
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    BnNgIdleService,

    AppConfig,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppConfig], multi: true },
    IconSetService,
    { provide: HTTP_INTERCEPTORS, useClass: EncryptDecryptAuth, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorIntercept, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
