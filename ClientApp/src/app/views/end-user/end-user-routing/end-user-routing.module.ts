import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ReportsComponent } from "../reports/reports.component";
import { EndUserComponent } from "../end-user.component";
import { LoginGuard } from "../../../core/guards/login.guard";
import { VmnlistComponent } from "../reports/vmnlist/vmnlist.component";
import { DetailedreportComponent } from "../reports/detailedreport/detailedreport.component";
import { SummaryreportComponent } from "../reports/summaryreport/summaryreport.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Reports",
    },
    children: [
      {
        path: "",
        canActivate: [LoginGuard],
        redirectTo: "vmnlist",
      },

      {
        path: "reports",
        canActivate: [LoginGuard],
        component: VmnlistComponent,
      },

      {
        path: "vmnlist",
        canActivate: [LoginGuard],
        component: VmnlistComponent,
        data: {
          title: "vmnlist",
        },
      },
      {
        path: "DetailedReport",
        canActivate: [LoginGuard],
        component: DetailedreportComponent,
        data: {
          title: "DetailedReport",
        },
      },
      {
        path: "SummaryReport",
        canActivate: [LoginGuard],
        component: SummaryreportComponent,
        data: {
          title: "SummaryReport",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EndUserRoutingModule {}
