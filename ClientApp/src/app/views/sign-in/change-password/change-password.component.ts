import { Component, HostListener, OnInit,ViewChild } from '@angular/core';
import { changepassmodel } from '../sign-in.model';
import { SigninService } from '../sign-in.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { PasswordStrengthBarComponent } from '../../../password-strength-bar/password-strength-bar.component';
import swal from 'sweetalert2';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-dashboard',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild("changepassForm") form: any;
  loading_msg: any = '';
  changepassmodel: changepassmodel = {};
  showMessageFlag:boolean;
  showMessagefromDBFlag:boolean;
  Message:string;
  MessagefromDB:string;
  paswdLength : any = 8;
  roleId: any;
  passwordIsValid = false;
  public barLabel: string = "Password strength:";
  constructor(private signinservice: SigninService,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService) { }

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
    this.roleId = this.signinservice.decryptData(sessionStorage.getItem("RoleID"))
    console.log("this.roleId",this.roleId)
    if(this.roleId == 1 || this.roleId == 2 || this.roleId == 3 || this.roleId == 4)this.paswdLength = 14
  }

  passwordValid(event) {
    this.passwordIsValid = event;
  }

  keyPress(event: any) {
    const pattern = /^\d+$/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  ChangePassword() {
    this.loading_msg = 'Changing password ....';
    this.spinner.show();
    if(!this.passwordIsValid)
    {
      this.showMessagefromDBFlag=true;

      this.MessagefromDB= "Weak Password..";
      this.timeOut();
      this.changepassmodel.newpassword="";
      this.changepassmodel.confpassword = "";
      this.spinner.hide();
      return false;
    }
    if(this.changepassmodel.newpassword!=this.changepassmodel.confpassword)
    {
      this.showMessagefromDBFlag=true;

      this.MessagefromDB= "Confirm password doesn't match with new password";
      this.timeOut();
      this.changepassmodel.newpassword="";
      this.changepassmodel.confpassword = "";
      this.spinner.hide();
      return false;
    }
    var OTP= this.changepassmodel.otp;
    this.changepassmodel.appname="SMS CAMPAIGN";
    this.changepassmodel.appid=1;
    this.changepassmodel.userid=Number(this.signinservice.decryptData(sessionStorage.getItem('UserID')));

    var passencrypted=CryptoJS.SHA1(this.changepassmodel.newpassword);
    this.changepassmodel.newpassword=passencrypted.toString();

    //before calling db validate captcha
    console.log("this.changepassmodel",this.changepassmodel)
     this.signinservice.ChangePassword(this.changepassmodel).subscribe((resp:any) => {

      //  console.log(resp[1][0]["@n_status_out"]);

     if(resp.status==1)
     {
       this.spinner.hide();
        swal({
          title: 'Success!!',
          text: "Your Credentials are succesfully changed. Please login again to continue",
          type: 'success',
          showCancelButton: false,
          confirmButtonColor: '#00B96F',
          confirmButtonText: 'OK',
          allowOutsideClick:false,
           onClose:()=>{
            return this.router.navigate(['/', 'login']);
         },
          timer:20000,
        });
      }
      else if(resp.status=="5"){
        //this.showMessagefromDBFlag=true;//show in login page
        //this.MessagefromDB=
       this.spinner.hide();
        swal({
          title: 'Failed!!',
          text: "Failed, OTP has Expired. Please login again to continue",
          type: 'error',
          showCancelButton: false,
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
          allowOutsideClick:false,
           onClose:()=>{
            return this.router.navigate(['/', 'login']);
         },
          timer:20000,
        });
      }
      else if(resp.status=="2"){
        this.showMessagefromDBFlag=true;
        this.changepassmodel.newpassword="";
        this.changepassmodel.confpassword="";
       this.MessagefromDB = "Invalid OTP! Authentication Failed!!";
       this.spinner.hide();
        this.timeOut();

      }
      else if(resp.status=="9"){
        this.showMessagefromDBFlag=true;
        this.changepassmodel.newpassword="";
        this.changepassmodel.confpassword="";
       this.MessagefromDB = "Old and new password are same!";
       this.spinner.hide();
        this.timeOut();
      }
      else
      {
        this.showMessagefromDBFlag=true;
        this.changepassmodel.newpassword="";
        this.changepassmodel.confpassword="";
       this.MessagefromDB = "Could not complete request.";
       this.spinner.hide();
        this.timeOut();
      }
     });
}
clear(): void {
  this.changepassmodel = <changepassmodel>{};
  this.form.reset();

}

  ResendOTP() {
    this.loading_msg = 'Resend OTP .....';
    this.spinner.show();
  this.changepassmodel.appid=1;
    this.changepassmodel.userid=Number(this.signinservice.decryptData(sessionStorage.getItem('UserID')));
    console.log("this.changepassmodel",this.changepassmodel)
  this.signinservice.ResendOTP(this.changepassmodel).subscribe((resp:any) => {

    // console.log(resp[1][0]["@n_Status_Out"]);

  if(resp.status==1)
   {
    this.toastr.success("Success,New OTP send to your mail id", 'Success!');
    this.spinner.hide();
     //send mail
     //let otp=Math.floor(Math.random() * (999999 - 100000) + 100000);
    //  this.signinservice.SendMail("VerifyOTP","ACP- Resend OTP",resp[1][0]["@n_Mid_Out"],this.signinservice.decryptData(sessionStorage.getItem('Email')),this.changepassmodel.otpBehind,this.signinservice.decryptData(sessionStorage.getItem('UserName'))).subscribe(resp => {

    //   // console.log("VerifyOTP "+resp);
    //   if(resp==true)
    //   {
    //     this.toastr.success("Success,New OTP send to your mail id", 'Success!');
    //   }
    //   else{
    //     this.toastr.warning("Unable to send mail. Please try again later", 'Warning!');
    //   }
    // });
   }
   else if(resp.status==3){
    this.toastr.warning("OTP has been sent too many times, please try after sometime", 'Warning!');
    this.spinner.hide();
   }
   else
   {
    this.toastr.error("Something Went Wrong", 'Error!');
    this.spinner.hide();
   }
  });

}

timeOut(){
  setTimeout(() => {
    this.MessagefromDB = "";
  }, 3000);
}
}
