import { Component, OnInit, ViewChild } from '@angular/core';
import { loginmodel } from '../sign-in.model';
import { SigninService } from '../sign-in.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, NavigationEnd, NavigationStart, RoutesRecognized } from '@angular/router';
import { Directive, HostListener } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { AppConfig } from '../../../core/AppConfig/app.config';
import { AppService } from '../../../app.service';
import { LoginService } from '../../../core/services/login.service';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  @ViewChild("logForm") form: any;
baseURL = AppConfig.Config.api.sms;
//baseURL = '/IncomingSMS/';
 // baseURL = AppConfig.Config.url;
  logmodel: loginmodel = {};
  Showmsg: boolean;
  Message: string;
  stepper: any;
  loginStyle: any;
  hrefUrl = window.location.href.slice(0, -7) + 'api'
  previousUrl: string;
  currentUrl: string = null;
  firstTimeFlag:boolean =false;
  defaultFlag :boolean = this.appService.defaultFlag;
  constructor(private appService: AppService, private signinservice: SigninService,
    private toastr: ToastrService, private location: LocationStrategy, private router: Router, private login: LoginService) {
      this.router.events
      .pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        // console.log('previous url', events[0].urlAfterRedirects,typeof(events[0].urlAfterRedirects));
        // this.previousUrl = events[0].urlAfterRedirects
        let previousUrl = events[0].urlAfterRedirects
        this.previousUrl = previousUrl
        const ssoURL = AppConfig.Config.api.sms;
      //  const ssoURL = '/IncomingSMS/';
      //  const ssoURL = AppConfig.Config.url;
        if (previousUrl == '/first-time-login') {
          window.location.href = ssoURL
          this.firstTimeFlag = true;
        }else{
          this.firstTimeFlag = false;
        }
      });
    //   this.router.events.pipe(
    //   filter((event) => event instanceof NavigationEnd)
    // ).subscribe((event: NavigationEnd) => {
    //   this.previousUrl = this.currentUrl;
    //   this.currentUrl = event.url;
    // });

      if(this.firstTimeFlag == false && (this.defaultFlag ==false||this.signinservice.decryptData(sessionStorage.getItem('defaultFlag')) == 'false')){
        if (this.signinservice.decryptData(sessionStorage.getItem('LoginID'))) {
          // console.log(this.previousUrl,"url")
          if (this.previousUrl != '/first-time-login' ) {
            // window.location.href = ssoURL
            //this.router.navigate(['/', 'accounts']);
          }
          else {}
        }
      }
  }


  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }


  ngOnInit() {
    window.sessionStorage.clear()
    this.Showmsg = false;
    this.Message = "";
    // if (this.signinservice.decryptData(sessionStorage.getItem('LoginID')) != null) {
    //   // console.log("yes logout")
    //   this.Logout(0);
    // }
    // sessionStorage.setItem('UserName', null);
    // this.IsDbAvailable();
    // sessionStorage.clear();
    this.preventBackButton();

  }

  // IsDbAvailable(){

  //   this.signinservice.IsDbAvailable().subscribe(resp => {
  //   });
  // };

  preventBackButton() {
    this.location.back();
  }
  Logout(mode: any) {
   // console.log("modeLogout",mode)
    this.signinservice.Logout(mode).subscribe(resp => {
      // console.log(resp[1][0]["@n_Status_Out"]);
      if (resp[1][0]["@n_Status_Out"] == 1) {
        sessionStorage.clear();
      }
      sessionStorage.setItem('IsLoggedIn', "false");
    });

  }

  encryptData(data) {
    return (CryptoJS.AES.encrypt(data, 'U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=').toString())
  }

  decryptData(encryptedData) {
    return (CryptoJS.AES.decrypt(encryptedData, 'U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=').toString(CryptoJS.enc.Utf8))
  }
  onSubmit() {
    this.Showmsg = false;
    this.logmodel.appname = "SMS CAMPAIGN";
    this.logmodel.appid = 1;
    /*   this.logmodel.password = CryptoJS.SHA256(this.logmodel.password).toString();*/

    this.logmodel.password = CryptoJS.SHA1(this.logmodel.password).toString();
    //console.log(this.logmodel.password);
    this.signinservice.Login(this.logmodel).subscribe(resp => {
      if (resp["status"] == "1") {
       // console.log(resp, "resp");
        //get username from db
        sessionStorage.setItem("UserID", this.signinservice.encryptData(resp["userId"]));
        sessionStorage.setItem("PswdRequired", this.signinservice.encryptData(resp["pwdRequired"]));
        sessionStorage.setItem("LoginID", this.signinservice.encryptData(resp["loginId"]));
        sessionStorage.setItem("RoleID", this.signinservice.encryptData(resp["roleId"]));
        sessionStorage.setItem("RoleName", this.signinservice.encryptData(resp["roleName"]));
        sessionStorage.setItem("Email", this.signinservice.encryptData(resp["email"]));
        sessionStorage.setItem("int_flag", this.signinservice.encryptData(resp["dltFlag"]));
        sessionStorage.setItem("UserName", this.signinservice.encryptData(resp["userName"]));
        sessionStorage.setItem("Company", this.signinservice.encryptData(resp["Company"]));
        sessionStorage.setItem("AccountId", this.signinservice.encryptData(resp["accountId"]));
        sessionStorage.setItem("CircleId", this.signinservice.encryptData(resp["CircleId"]));
        sessionStorage.setItem("OTPType", resp["otpType"]);
        sessionStorage.setItem('IsLoggedIn', this.signinservice.encryptData("true"));
        sessionStorage.setItem('sessionId', this.signinservice.encryptData("12345"));
       //  console.log("pwdRequired",resp["pwdRequired"])
        const session = sessionStorage.getItem('Status');
        if (resp["pwdRequired"] == 1) {
          return this.router.navigate(['/', 'first-time-login']);
        }
        else if (resp["pwdRequired"] == 0) {
          // console.log(this.router, "Router")
          if (resp["roleId"] == 1) {
            return this.router.navigate(['/', 'dashboard']);
          } else if (resp["roleId"] == 2) {
            return this.router.navigate(['/', 'dashboard']);
          } else if (resp["roleId"] == 6) {
            return this.router.navigate(['/', 'dashboard']);
          }
          else if (resp["roleId"] == 3) {
           // alert("role id:3");
           // this.router.navigate(['/EndUser/reports']);
            return this.router.navigate(['/', 'EndUser']);
          }
          else
            return this.router.navigate(['/', '404']);
        }
        else if (resp["pwdRequired"] == 3 || resp["pwdRequired"] == 10 || resp["pwdRequired"] == 11 || resp["pwdRequired"] == 12 || resp["pwdRequired"] == 13) {
          return this.router.navigate(['/', 'authenticate-user']);
        }
        else if (resp["pwdRequired"] == 7) {
          return this.router.navigate(['/', 'security-question']);
        }
        else {
          return this.router.navigate(['/', 'Unauthorized']);
        }
      }
      else if (resp["status"] == 9) {
        this.Showmsg = true;
        this.Message = "Invalid User !";
        this.logmodel.password = "";
        this.logmodel.username = "";
        setTimeout(() => {
          this.Message = "";
        }, 3000);
      } else if (resp["status"] == 10) {
        this.Showmsg = true;
        this.Message = "Invalid Password !";
        this.logmodel.password = "";
        this.logmodel.username = "";
        setTimeout(() => {
          this.Message = "";
        }, 3000);
      }
      else if (resp["status"] == 5) {
        this.Showmsg = true;
        this.Message = "Some error occured !";
        this.logmodel.password = "";
        this.logmodel.username = "";
        setTimeout(() => {
          this.Message = "";
        }, 3000);
      }
      else {
        return this.router.navigate(['/', '500']);
      }

    });
  }
  clear(): void {
    this.logmodel = <loginmodel>{};
    this.form.reset();

  }
}
