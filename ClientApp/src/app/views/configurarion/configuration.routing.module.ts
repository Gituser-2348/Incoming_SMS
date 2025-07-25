import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { LoginGuard } from '../../core/guards/login.guard';
import { ConfigurarionComponent } from './configurarion.component';


var routes: Routes = [
  {
    path: '',
    data: {
      title: 'Configuration',
    },
    children: [
      {
        path: '',
        canActivate: [LoginGuard],
        redirectTo: 'Configuration'
      },
      {
        path: 'Configuration',
        canActivate: [LoginGuard],
        component: ConfigurarionComponent,
        data: {
          title: 'Configuration'
        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {

}
