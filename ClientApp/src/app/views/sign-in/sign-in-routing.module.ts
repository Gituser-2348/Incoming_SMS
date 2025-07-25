import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import { LoginGuard } from '../../core/guards/login.guard';
import { AuthGuard } from '../../core/guards/auth.guard';
import { SignInComponent } from './sign-in.component';
import { LoginComponent } from './login/login.component';
import { SecurityQuestionComponent } from './security-question/security-question.component';
import { AuthenticateUserComponent } from './authenticate-user/authenticate-user.component';
import { FirstTimeLoginComponent } from './first-time-login/first-time-login.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ApiDocComponent } from './api-doc/api-doc.component';

import { SigninService } from './sign-in.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DefaultLayoutComponent } from '../../containers';


var routes: Routes = [
  {
    path: '',
    data: {
      title: 'Sign-in'
    },
    children: [
      {
        path: '',
        redirectTo: 'login'
      },


      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'sign-in'
        }
      },
      {
        path: 'api',
        component: ApiDocComponent,
        data: {
          title: 'API'
        }
      },
      {
        canActivate:[LoginGuard],
        path: 'security-question',
        component: SecurityQuestionComponent,
        data: {
          title: 'security'
        }
      },
      {
        canActivate:[LoginGuard],
        path: 'first-time-login',
        component: FirstTimeLoginComponent,
        data: {
          title: 'security'
        }
      },
      {

        path: 'authenticate-user',
        component: AuthenticateUserComponent,
        data: {
          title: 'security'
        }
      },
      {
        // canActivate:[AuthGuard],
        path: 'change-password',
        component: ChangePasswordComponent,
        data: {
          title: 'security'
        }
      }


    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SigninRoutingModule {
  // constructor(private signinservice :SigninService,private router:Router){
  //   if(this.signinservice.decryptData(sessionStorage.getItem('LoginID'))&&
  //   this.signinservice.decryptData(sessionStorage.getItem('PswdRequired'))!='1'){
  //     // this.router.navigate(['/dashboard']);
  //     // console.log("Called")
  //     let newroute = [
  //       {
  //         path: '',
  //         component: DefaultLayoutComponent,
  //         // data: {
  //         //   title: 'Home'
  //         // },
  //         children: [
  //           {
  //             path:'',
  //             redirectTo: '/dashboard',
  //             pathMatch: 'full'
  //           },
  //           {
  //             path: 'accounts',
  //             canActivate:[LoginGuard],
  //             loadChildren: () => import('./../accounts/accounts.module').then(m => m.AccountsModule)
  //           },
  //           {
  //             path: 'report',
  //             canActivate:[LoginGuard],
  //             loadChildren: () => import('./..//report/report.module').then(m => m.ReportModule)
  //           },
  //           // {
  //           //   path: 'dashboard',
  //           //   canActivate:[LoginGuard],
  //           //   loadChildren: () => import('./../dashboard/dashboard.module').then(m => m.DashboardModule)
  //           // },
  //           {
  //             path: 'flow',
  //             canActivate:[LoginGuard],
  //             loadChildren: () => import('./../flow/flowbuilder.module').then(m=>m.FlowbuilderModule)
  //           },
  //         ]
  //       },
  //     ]
  //     this.router.resetConfig(newroute)
  //    }
  // }


}
