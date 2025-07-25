import { ChangeDetectorRef, Component, HostListener, OnInit,ViewChild } from '@angular/core';

import { firstTimeLoginModel,SecQuestionddl } from '../sign-in.model';
import { SigninService } from '../sign-in.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import swal from 'sweetalert2';
import { AppConfig } from '../../../core/AppConfig/app.config';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-dashboard',
  templateUrl: './first-time-login.component.html',
  styleUrls: ['./first-time-login.component.scss']
})
export class FirstTimeLoginComponent implements OnInit {
  @ViewChild("firsttimeForm") form: any;
  firstTimemodel: firstTimeLoginModel = {};
  SecQuestion=Array<SecQuestionddl>();
  Showmsg:boolean;
  Message:string;
  roleId: any;
  paswdLength: any = 8
  passwordIsValid = false;
  public barLabel: string = "Password strength:";
  constructor(private signinservice: SigninService,
    private toastr: ToastrService, private router: Router, private changeDec: ChangeDetectorRef, private spinner: NgxSpinnerService) {
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

  ngOnInit(): void {
    this.spinner.hide();
    this.roleId = this.signinservice.decryptData(sessionStorage.getItem("RoleID"))
    if(this.roleId == 1 || this.roleId == 2 || this.roleId == 3 || this.roleId == 4)this.paswdLength = 8
    this.Showmsg=false;
    this.getSecQuestionList();
    this.firstTimemodel.Answer = ""
  }
  passwordValid(event) {
    this.passwordIsValid = event;

  }
  getSecQuestionList() {
    var userId=this.signinservice.decryptData(sessionStorage.getItem('UserID'))
    // console.log(userId,'entered');
    this.signinservice.getSecQuestionList(userId).subscribe((resp:any) => {
      this.changeDec.detectChanges();
      this.SecQuestion = resp.Qns;
      // console.log(resp,'resp');
    });
  }
  FirstTimeLogin() {
    this.spinner.show();
   // console.log("----------"+this.firstTimemodel.SecurityQuestion )
    this.firstTimemodel.appid=1;
    if(!this.passwordIsValid)
    {
      this.Showmsg=true;
      this.Message= "Weak Password..";
      this.timeOut();
      this.firstTimemodel.newpassword="";
      this.firstTimemodel.confirmpassword = "";
      this.spinner.hide();
      return false;
    }
    if(this.firstTimemodel.newpassword!=this.firstTimemodel.confirmpassword)
    {
      this.Showmsg=true;

      this.Message= "Confirm password doesn't match with new password";
      this.timeOut();
      this.firstTimemodel.newpassword="";
      this.firstTimemodel.confirmpassword = "";
      this.spinner.hide();
      return false;
    }
    if(this.firstTimemodel.SecurityQuestion==undefined)
    {
      this.Showmsg=true;

      this.Message= "Security Question required!";
      this.timeOut();
      this.firstTimemodel.newpassword="";
      this.firstTimemodel.confirmpassword = "";
      this.spinner.hide();
      return false;
    }
    if(this.firstTimemodel.Answer.trim().length ==0){
      this.Showmsg=true;

      this.Message = "Answer is required!";
      this.spinner.hide();
      this.timeOut();
      return false;
    }
    // console.log(this.firstTimemodel,"FirstTime Model")
    
    var passencrypted = CryptoJS.SHA1(this.firstTimemodel.newpassword).toString();
    this.firstTimemodel.newpassword=passencrypted.toString();
    this.firstTimemodel.userid=Number(this.signinservice.decryptData(sessionStorage.getItem('UserID')));

     this.signinservice.FirstTimeLogin(this.firstTimemodel).subscribe((resp:any) => {
      console.log("this.firstTimemodelresp")
       if(resp.status==1){
       const ssoURL = AppConfig.Config.api.sms;
         // const ssoURL ='/IncomingSMS';
       //  const ssoURL = AppConfig.Config.url;
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
                  // return this.router.navigate(['/', 'login']);
                  window.location.href = ssoURL
                  sessionStorage.clear()
               },
                timer:20000,
              });
        }
        else if(resp.status==9){
        this.Showmsg=true;
         this.Message = "User not found!";
         this.spinner.hide();


        this.timeOut();
        this.firstTimemodel.newpassword="";
        this.firstTimemodel.confirmpassword="";
        }
        else if(resp.status== 2){
         console.log("New and old passwords can not be same")
         this.spinner.hide();
        this.Showmsg=true;
        this.Message="New and old passwords can not be same";
        this.timeOut();
        this.firstTimemodel.newpassword="";
        this.firstTimemodel.confirmpassword="";
        }
        else{
          this.firstTimemodel.newpassword="";
         this.firstTimemodel.confirmpassword = "";
         this.spinner.hide();
          this.toastr.error("Something Went Wrong", 'Error!');
       }
     });
  }

  timeOut(){
    setTimeout(() => {
      this.Message = "";
    }, 3000);
  }
}
