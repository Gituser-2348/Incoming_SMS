import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { LoginGuard } from '../../core/guards/login.guard';
import { ManageVMNComponent } from './manage-vmn.component';


var routes: Routes = [
  {
    path: '',
    data: {
      title: 'Management',
    },
    children: [
      {
        path: '',
        canActivate:[LoginGuard],
        redirectTo: 'ManageVMN'
      },
      {
        path: 'ManageVMN',
        canActivate:[LoginGuard],
        component: ManageVMNComponent,
        data: {
          title: 'ManageVMN'
        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementVMNRoutingModule {

}
