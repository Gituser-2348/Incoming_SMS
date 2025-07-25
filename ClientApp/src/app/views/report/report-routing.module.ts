import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../../core/guards/login.guard';
import { DetailedComponent } from './detailed/detailed.component';
import { SummaryComponent } from './summary/summary.component';
//import { ConfigComponent } from './config/config.component';
//import { ChatreportComponent } from './chatreport/chatreport.component';
//import { AgentReportComponent } from './agent-report/agent-report.component';
//import { PmmwComponent } from './pmmw/pmmw.component';
import { VMNListComponent } from './vmnlist/vmnlist.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Reports'
    },
    children: [

      {
        path: '',
        canActivate: [LoginGuard],
        redirectTo: 'Detailed'
      },
      //},
      //{
      //  path: 'configuration',
      //  canActivate: [LoginGuard],
      //  component: ConfigComponent,
      //  data: {
      //    title: 'Report Configuration'
      //  }
      //},
      //},
      //{
      //  path: 'agentReport',
      //  canActivate:[LoginGuard],
      //  component: AgentReportComponent,
      //  data: {
      //    title: 'Agent Report'
      //  }
      //},
      {
        path: 'Detailed',
        canActivate:[LoginGuard],
        component: DetailedComponent,
        data: {
          title: 'detailed'
        }
      },
      {
        path: 'VMNList',
        canActivate: [LoginGuard],
        component: VMNListComponent,
        data: {
          title: 'VMNList'
        }
      },
      //{
      //  path: 'apiReport',
      //  canActivate:[LoginGuard],
      //  component: PmmwComponent,
      //  data: {
      //    title: 'api'
      //  }
      //},
      {
        path: 'Summary',
        canActivate:[LoginGuard],
        component: SummaryComponent,
        data: {
          title: 'summary'
        }
      }
      //{
      //  path: 'chatreport',
      //  component: ChatreportComponent,
      //  data: {
      //    title: 'chatreport'
      //  }
      //}

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
