import { Component, OnInit } from '@angular/core';
import { Router,  } from '@angular/router';
import { SigninService } from '../../../views/sign-in/sign-in.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {
  displayStyle:string;
  RoleID:string;
  Registered:string;
  constructor(private router:Router,
    private signInService :SigninService) {

   }

  ngOnInit(): void {
    this.RoleID=this.signInService.decryptData(sessionStorage.getItem("RoleID"));
    this.Registered=this.signInService.decryptData(sessionStorage.getItem("Registered"));
    if(this.RoleID == "3"  && this.Registered=="1"){
    this.displayStyle="block"
    }
  }
  ok(){
   return this.router.navigate(['/login']);
  }

}
