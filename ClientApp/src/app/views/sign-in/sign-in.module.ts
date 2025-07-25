import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SigninRoutingModule } from './sign-in-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxCaptchaModule} from 'ngx-captcha';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { FirstTimeLoginComponent } from './first-time-login/first-time-login.component';
import { AuthenticateUserComponent } from './authenticate-user/authenticate-user.component';
import { SecurityQuestionComponent } from './security-question/security-question.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PasswordStrengthBarComponent } from '../../password-strength-bar/password-strength-bar.component';
import { ApiDocComponent } from './api-doc/api-doc.component';
import { NgxSpinnerModule } from "ngx-spinner";
@NgModule({
  declarations: [LoginComponent,LogoutComponent, FirstTimeLoginComponent, AuthenticateUserComponent, SecurityQuestionComponent, ChangePasswordComponent,PasswordStrengthBarComponent,ApiDocComponent],
  imports: [
    CommonModule,
    SigninRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCaptchaModule, NgxSpinnerModule
    ]
})
export class SigninModule { }
