import { Component, OnInit ,HostListener} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { IconSetService } from '@coreui/icons-angular';
import { freeSet } from '@coreui/icons';

import swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SigninService } from './views/sign-in/sign-in.service';
//import { AccountsService } from './views/accounts/accounts.service';
import { filter } from "rxjs/operators";
import { FlowbuilderService } from './views/flow/flowbuilder.service';
import { AppService } from './app.service';
import { Build } from './shared/app-enum.model';


@Component({
  // tslint:disable-next-line
  selector: 'body',
  template: '<router-outlet></router-outlet>',
  providers: [IconSetService]
  
})
export class AppComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private bnIdle: BnNgIdleService,
    private router: Router,
    public iconSet: IconSetService,
    private toastr: ToastrService,
    private signInService: SigninService,
    private appService: AppService) {

    // iconSet singleton
    //sessionStorage.setItem('IsLoggedIn',"false");
    iconSet.icons = { ...freeSet };
  }
  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHandler(event) {
  //   return false
  // }


  ngOnInit() {
    //this.appService.buildName = this.appService.buildName;    
    router: Router;
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
      if (this.signInService.decryptData(sessionStorage.getItem('IsLoggedIn')) == "true") {
        if (isTimedOut) {

          swal({
            title: 'Session Expires!!',
            text: "You will be Logged out in 20 seconds",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#00B96F',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Stay',
            cancelButtonText: 'Logout',
            allowOutsideClick: false,
            // onClose:()=>{
            //   return this.router.navigate(['/', 'login']);
            // },
            timer: 20000,
          }).then((result) => {
            // console.log("gggg" + result.value);
            if (result.value) {
              this.bnIdle.resetTimer();
            }
            else {
              //return this.router.navigate(['/', 'login']);
              var LoginID = this.signInService.decryptData(sessionStorage.getItem('LoginID'));
              this.signInService.logout(LoginID, 0).subscribe((resp) => {
              window.sessionStorage.clear();
              sessionStorage.setItem('IsLoggedIn', "false");
              }, error => {
              window.sessionStorage.clear();
              sessionStorage.setItem('IsLoggedIn', "false");
             });
             this.router.navigate(['/', 'login']);
            }

          });


        }
      }
    });

  }



}
