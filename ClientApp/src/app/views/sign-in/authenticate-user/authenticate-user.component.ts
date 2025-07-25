import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  HostListener
} from '@angular/core';
import { authusermodel, SecQuestionddl } from '../sign-in.model';
import { SigninService } from '../sign-in.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import swal from 'sweetalert2';
import { NgxCaptchaModule } from 'ngx-captcha';
import { ReCaptcha2Component } from 'ngx-captcha';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dashboard',
  templateUrl: './authenticate-user.component.html',
  styleUrls: ['./authenticate-user.component.scss']
})


export class AuthenticateUserComponent implements OnInit {


  protected aFormgroup: FormGroup;
  @ViewChild("authuserForm") form: any;
  SecQuestion = Array<SecQuestionddl>();
  authmodel: authusermodel = {"SecurityQuestion": "-1"};
  showResetFlag: boolean;
  CanLater: boolean;
  pswdFlag: string;
  showMessageFlag: boolean;
  showMessagefromDBFlag: boolean;
  Message: string;
  MessageDesc: string;
  MessagefromDB: string;
  paswdLength: any = 8
  roleId: any;
  passwordIsValid = false;
  public barLabel: string = "Password strength:";
  constructor(private signinservice: SigninService,
    private toastr: ToastrService,
    private router: Router,
    private changeDec: ChangeDetectorRef, private spinner: NgxSpinnerService
  ) { }
  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }

  ngOnInit(): void {
    this.spinner.hide();
    this.getSecQuestionList();
    this.showMessageFlag = false;
    this.CanLater = false;
    this.showMessagefromDBFlag = false;
    this.pswdFlag = this.signinservice.decryptData(sessionStorage.getItem('PswdRequired'));
    if (this.pswdFlag == "3" || this.pswdFlag == "10" || this.pswdFlag == "11" || this.pswdFlag == "12" || this.pswdFlag == "13") {
      this.roleId = this.signinservice.decryptData(sessionStorage.getItem("RoleID"))
      if(this.roleId == 1 || this.roleId == 2 || this.roleId == 3 || this.roleId == 4)this.paswdLength = 14
      this.showResetFlag = true;
      this.BindResetMessages();
    }
    else {
      this.showResetFlag = false;
    }

  }

  getSecQuestionList() {

    var userid ="-1";
    // if (this.signinservice.decryptData(sessionStorage.getItem('UserID')) == null) {
    //   userid = "-1";

    // }
    // else {
    //   userid = this.signinservice.decryptData(sessionStorage.getItem('UserID'));
    // }
    this.signinservice.getSecQuestionList(userid).subscribe((resp:any) => {

      this.SecQuestion = resp.Qns;
      if (resp.QnId == null) {
        this.authmodel.SecurityQuestion = "-1";
      }
      else {
        this.authmodel.SecurityQuestion = resp.QnId;
      }
      this.changeDec.detectChanges();
    });
  }
  BindResetMessages() {
    this.showMessageFlag = true;
    if (this.pswdFlag == "10") {
      this.Message = "Password Expires Soon";
      this.MessageDesc = "Your password expires today. Please reset.";
      this.CanLater = true;
    }
    else if (this.pswdFlag == "11") {
      this.Message = "Password Expires Soon";
      this.MessageDesc = "Your password will expire tomorrow. Please reset.";
      this.CanLater = true;
    }
    else if (this.pswdFlag == "12") {
      this.Message = "Password Expires Soon";
      this.MessageDesc = "Your password will expire in 2 days. Please reset.";
      this.CanLater = true;
    }
    else if (this.pswdFlag == "13") {
      this.Message = "Password Expires Soon";
      this.MessageDesc = "Your password will expire in 3 days. Please reset.";
      this.CanLater = true;
    }
    else if (this.pswdFlag == "3") {
      this.Message = "Password Expired";
      this.MessageDesc = "Please reset to continue";
    }
    else {
      this.Message = "Change Password";
    }
    this.changeDec.detectChanges();

  }

  passwordValid(event) {
    this.passwordIsValid = event;
  }
  GenerateOTP() {
   this.spinner.show();
    this.authmodel.appname = "SMS CAMPAIGN";
    this.authmodel.appid = 1;
    if (this.signinservice.decryptData(sessionStorage.getItem('UserName')) != null) {
      this.authmodel.username = this.signinservice.decryptData(sessionStorage.getItem('UserName'));
    }
    if (this.showResetFlag == true) {
      var passencrypted = CryptoJS.SHA256(this.authmodel.oldpassword);
      this.authmodel.oldpassword = passencrypted.toString();
      if (!this.passwordIsValid) {
        this.spinner.hide();
        this.showMessagefromDBFlag = true;
        this.MessagefromDB = "Weak Password..";
        this.timeOut();
        this.authmodel.oldpassword = "";
        return false;
      }
    }else {
      this.authmodel.oldpassword = "";
    }
    if (this.authmodel.SecurityQuestion == "-1" || this.authmodel.username.trim().length == 0 || this.authmodel.Answer.trim().length == 0) {
      this.spinner.hide();
      this.showMessagefromDBFlag = true;
      this.MessagefromDB = "Please fill all the details !";
      this.timeOut();
      return false;
    }
    // if (this.authmodel.username.trim().length ==0) {
    //   this.showMessagefromDBFlag = true;
    //   this.MessagefromDB = "Username is required!";
    //   this.timeOut();
    //   return false;
    // }
    console.log("this.authmodel",this.authmodel)
    this.signinservice.AuthenticateUser(this.authmodel).subscribe((resp:any) => {

      if (resp.status == 1) {
        sessionStorage.setItem('UserID', this.signinservice.encryptData(resp.userid));
        sessionStorage.setItem('Email', this.signinservice.encryptData(resp.mailid));
        if (this.signinservice.decryptData(sessionStorage.getItem('RoleID')) == null) {
          //in case of forgot password
          sessionStorage.setItem('RoleID', this.signinservice.encryptData(resp.roleid));
          sessionStorage.setItem('UserName', this.signinservice.encryptData(this.authmodel.username));
        }
        // console.log(this.authmodel,"Model")

        //this.spinner.hide();
        //take msg from here to change pass page
        this.toastr.success("An OTP has been send to your mail", 'Success!');
        return this.router.navigate(['\change-password']);
      }
      else {
        this.spinner.hide();
        console.log("Authentication Failed!")
        this.showMessagefromDBFlag = true;
        this.authmodel.oldpassword = "";
        this.MessagefromDB = "Authentication Failed!";
        this.changeDec.detectChanges();
        setTimeout(() => {
          this.MessagefromDB="";
          this.changeDec.detectChanges();
        }, 3000);

      }


    });
    // }
   // this.spinner.hide();
  }
  clear(): void {
    this.authmodel = <authusermodel>{};
    this.form.reset();

  }
  timeOut(){
    setTimeout(() => {
      this.MessagefromDB="";
    }, 3000);
   }


}
