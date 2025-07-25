import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";
import { LoginGuard } from "./core/guards/login.guard";
import { DashboardComponent } from "./views/dashboard/dashboard.component";

import { P404Component } from "./views/error/404.component";
import { P500Component } from "./views/error/500.component";
import { SignInComponent } from "./views/sign-in/sign-in.component";
import { RegisterComponent } from "./views/register/register.component";
import { ErrorcodesComponent } from "./views/report/errorcodes/errorcodes.component";
import { ManageVMNComponent } from "./views/manage-vmn/manage-vmn.component";
import { ConfigurarionComponent } from "./views/configurarion/configurarion.component";
import { ReportComponent } from "./views/report/report.component";
/*import * as path from "path";*/
import { EndUserComponent } from './views/end-user/end-user.component';
import { ReportsComponent } from './views/end-user/reports/reports.component';
import { DetailedreportComponent } from './views/end-user/reports/detailedreport/detailedreport.component';
import { SummaryreportComponent } from './views/end-user/reports/summaryreport/summaryreport.component';
import { VmnlistComponent } from './views/end-user/reports/vmnlist/vmnlist.component';

export const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./views/sign-in/sign-in.module").then((m) => m.SigninModule),
  },

  // {
  //   path: '',
  //   redirectTo: 'acp',
  //   pathMatch: 'full',
  // },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "*",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  
  {
    path: "",
    component: DefaultLayoutComponent,

    children: [
      {
        path: "dashboard",
        //canActivate: [LoginGuard],
        //component: DashboardComponent,
        canActivate: [LoginGuard],
        loadChildren: () =>
          import("./views/dashboard/dashboard.module").then(
            (m) => m.DashboardModule
          ),
      }, {
        path: "EndUser",
        //canActivate: [LoginGuard],
        //component: DashboardComponent,
        canActivate: [LoginGuard],
        loadChildren: () =>
          import("./views/end-user/end-user/end-user.module").then(
            (m) => m.EndUserModule
          ),
      },
      // {
      //   path: "ManageVMN",
      //    canActivate:[LoginGuard],
      //   component: ManageVMNComponent  ,
      // },
      {
        path: "ManageVMN",
        canActivate:[LoginGuard],
        loadChildren: () =>
        import("./views/manage-vmn/manage-vmn.module").then(
          (m) => m.ManageVMNModule
        ),
      },
      {
       // path: 'modulePath', loadChildren: () => import('../some-module/some-module.module').then(m => m.some - module)

        path: "Configuration",
        // canActivate:[LoginGuard],
        //component: ConfigurarionComponent,
        canActivate: [LoginGuard],
        loadChildren: () =>
          import("./views/configurarion/configurarion.module").then(
            (m) => m.ConfigurarionModule
          ),
      },
      //{
      //  path: "accounts",
      //  canActivate: [LoginGuard],
      //  loadChildren: () =>
      //    import("./views/accounts/accounts.module").then(
      //      (m) => m.AccountsModule
      //    ),
      //},
     
      {
        path: "Report",
        canActivate: [LoginGuard],
        loadChildren: () =>
          import("./views/report/report.module").then((m) => m.ReportModule),
      },
      //{
      //  path: "service",
      //  // canActivate: [LoginGuard],
      //  loadChildren: () =>
      //    import("./views/smsservice/smsservice.module").then(
      //      (m) => m.SmsserviceModule
      //    ),
      //},
      //{
      //  path: "manage",
      //  // canActivate: [LoginGuard],
      //  loadChildren: () =>
      //    import("./views/management/management.module").then(
      //      (m) => m.ManagementModule
      //    ),
      //},
      {
        path: "errorcodes",
        // canActivate: [LoginGuard],
        component: ErrorcodesComponent,
      },
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
