import { Component, HostListener, OnInit,ViewChild } from '@angular/core';
import { firstTimeLoginModel,SecQuestionddl } from '../sign-in.model';
import { SigninService } from '../sign-in.service';
import { ToastrService } from 'ngx-toastr';
import * as CryptoJS from 'crypto-js';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.scss']
})
export class SecurityQuestionComponent implements OnInit {
  @ViewChild("securityForm") form: any;
  firstTimemodel: firstTimeLoginModel = {};
  SecQuestion=Array<SecQuestionddl>();
  Showmsg:boolean;
  Message: string;
  roleid: any;
  constructor(private signinservice: SigninService,
    private toastr: ToastrService,private router:Router) { }
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

    this.Showmsg=false;
    this.getSecQuestionList();
  }

  getSecQuestionList() {
    this.signinservice.getSecQuestionList(this.signinservice.decryptData(sessionStorage.getItem('UserID'))).subscribe((resp:any) => {
      // console.log(resp[2][0]["@n_Questid_Out"]);
      this.SecQuestion =  resp.Qns;
      this.firstTimemodel.SecurityQuestion=resp.QnId;
    });
  }
  VerifySecurityQs() {
    if(this.firstTimemodel.SecurityQuestion==undefined)
    {
      return false;
    }
    this.firstTimemodel.appid=1;
    this.firstTimemodel.userid = this.signinservice.decryptData(sessionStorage.getItem('UserID'));
     this.signinservice.VerifySecurityQs(this.firstTimemodel).subscribe((resp:any) => {
       //  console.log("VerifySecurityQs-"+resp);
       this.roleid = this.signinservice.decryptData(sessionStorage.getItem("RoleID"));
     //  console.log(this.roleid);
       
       if (resp.status == 1) {
         if (this.roleid == 3) {
           this.router.navigate(['/EndUser/reports']);
         } else {
           return this.router.navigate(['/', 'dashboard']);
         }

            

       } 
        else {
        this.Showmsg=true;
        this.Message="Authentication Failed!";
        setTimeout(() => {
          this.Message = "";
        }, 3000);
        }

     });
  }
}
