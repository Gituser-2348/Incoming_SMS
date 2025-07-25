import {NgModule} from '@angular/core';
import {A11yModule} from '@angular/cdk/a11y';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBadgeModule} from '@angular/material/badge';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTreeModule} from '@angular/material/tree';
import {OverlayModule} from '@angular/cdk/overlay';
import { ManageVMNComponent } from './manage-vmn/manage-vmn.component';
import { ConfigurarionComponent } from './configurarion/configurarion.component';
import { RequestComponent } from './configurarion/request/request.component';
import { InfoComponent } from './configurarion/info/info.component';
import { NumbersComponent } from './configurarion/numbers/numbers.component';
import { UrlComponent } from './configurarion/url/url.component';
import { WebuserComponent } from './configurarion/webuser/webuser.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddparameterComponent } from './configurarion/url/addparameter/addparameter.component';

import { EndUserComponent } from './end-user/end-user.component';
import { ReportsComponent } from './end-user/reports/reports.component';
import { VmnlistComponent } from './end-user/reports/vmnlist/vmnlist.component';
import { SummaryreportComponent } from './end-user/reports/summaryreport/summaryreport.component';
import { DetailedreportComponent } from './end-user/reports/detailedreport/detailedreport.component';
import { StatusRemarkComponent } from './manage-vmn/status-remark/status-remark.component';
import { ActionvmnComponent } from './manage-vmn/actionvmn/actionvmn.component';
import { NewrequestComponent } from './configurarion/request/newrequest/newrequest.component';

//import { MatStepper } from '@angular/material/stepper';
import { ViewChild } from '@angular/core';
import { ApiurltestComponent } from './manage-vmn/apiurltest/apiurltest.component';

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule
    // Other imports
  ],
  exports: [
    A11yModule,
    CdkAccordionModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    OverlayModule,
    PortalModule,
    ScrollingModule,
    FormsModule,
   /* MatStepper,*/
    ViewChild
  ],
  declarations: [
    // ManageVMNComponent,
    // ConfigurarionComponent,
    // RequestComponent,
    // InfoComponent,
    // NumbersComponent,
    // UrlComponent,
    // WebuserComponent,
    // AddparameterComponent,
    // ReportsComponent,
    // EndUserComponent,
    // ReportsComponent,
  //  VmnlistComponent,
    // SummaryreportComponent,
    // DetailedreportComponent,
    // StatusRemarkComponent,
    // ActionvmnComponent,
    NewrequestComponent,
    // ApiurltestComponent
  ]
})
export class MaterialExampleModule {}
