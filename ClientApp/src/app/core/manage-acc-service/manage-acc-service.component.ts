
import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { FlowbuilderService } from '../../views/flow/flowbuilder.service';
import { SigninService } from '../../views/sign-in/sign-in.service';
//import { FlowService } from '../../flow/shared/flow.service';
import { AuthService } from '../services/auth.service';
import { AccountInfo, ServiceInfo } from './data';
import { ManageAccServiceService } from './manage-acc-service.service';

// const versionUrl = 'https://material.angular.io/assets/versions.json';

@Component({
  selector: 'app-manage-acc-service',
  templateUrl: './manage-acc-service.component.html',
  styleUrls: ['./manage-acc-service.component.css']
})
export class ManageAccServiceComponent implements OnInit {
  show: boolean = false;
  myControl = new FormControl();
  selectedAccount: AccountInfo = {
    Value: "-1",
    Text: '',
  };
  selectedService: ServiceInfo = {
    Value: "-1",
    Text: ''
  };
  /** The possible versions of the doc site. */
  accInfo: Observable<AccountInfo[] | undefined>;
  serviceInfo: Observable<ServiceInfo[] | undefined>;
  Isadmin: boolean;
  IsAccSelectDisabled: boolean = false;
  IsServiceSelectDisabled: boolean = false;
  mySubscription: any;
  constructor(private service: ManageAccServiceService,
    private router: Router,
    private flowservice: FlowbuilderService,
    private signInService :SigninService) {
    // this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //   return false;
    // };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (this.router.url == '/flow/flow'||this.router.url == '/flow/flowpreview') {
        this.show = true;
        this.IsAccSelectDisabled = true;
        this.IsServiceSelectDisabled = true
        sessionStorage.setItem('sidebar','close')
        this.service.refresh.next('close')
      } else {
        this.show = false;
        if(this.signInService.decryptData(sessionStorage.getItem("RoleID"))<"3"){
          this.IsAccSelectDisabled = false;
        this.IsServiceSelectDisabled = false;
        }else{
          this.IsAccSelectDisabled = true;
          this.IsServiceSelectDisabled = true;
        }
        sessionStorage.setItem('sidebar','open')
        this.service.refresh.next('open')
      }
    });
  }

  ngOnInit() {
    if (this.show) {
      this.IsAccSelectDisabled = true;
      this.IsServiceSelectDisabled = true
    } else {
      this.IsAccSelectDisabled = false;
      this.IsServiceSelectDisabled = false
    }
    //   this.Isadmin = this.authService.IsAdmin;
    this.serviceInfo = new Observable<ServiceInfo[]>();
    //console.log(this.serviceInfo);

    // if (this.authService.IsAdmin) {
    //   this.getAccounts();
    //   this.IsAccSelectDisabled = false;
    // } else {
    this.getAccounts().subscribe((accounts: any) => {
      console.log(accounts,'acc');
      if(accounts[0]){
        this.selectedAccount=accounts[0];
        if(this.signInService.decryptData(sessionStorage.getItem("RoleID"))<"3"){
          this.IsAccSelectDisabled=false;
        }else{
          this.IsAccSelectDisabled = true;
        }
      }else{
        this.IsAccSelectDisabled = false;
      }
      // this.selectedAccount = accounts.filter(acc => acc.Id == this.authService.currentUserValue.accountId)[0];
      // this.accountchange(this.service.SelectedAccount);
      this.service.SelectedAccount = this.selectedAccount;
      // if (this.authService.IsSupervisor || this.authService.IsAgent) {
      //   this.getServices(this.selectedAccount).subscribe(services => {
      //     console.log("services : #### ", services);
      //     if (services.length > 0) {
      //       this.selectedService = services[0];
      //       this.service.SelectedService = this.selectedService;
      //     } else {
      //       this.selectedService = { Id: '-1', Value: '', Type: 0 };
      //       this.service.SelectedService = this.selectedService;
      //     }
      //   });
      // } else {
      //   this.getServices(this.selectedAccount);
      // }
    });
    //}

    // if (this.authService.IsAdmin || this.authService.IsSupport || this.authService.IsAccountManager) {
    //   this.IsServiceSelectDisabled = false;
    // }

    // this.service.serviceChanged.subscribe((service: any) => {
    //   this.selectedService = service;
    // });


  }

  getAccounts() {
    
    // this.service.getacconts().subscribe((data:any)=>{
    //   if(data[0]){
    //     this.selectedAccount=data[0];
    //     if(this.signInService.decryptData(sessionStorage.getItem("RoleID"))<"3"){
    //       this.IsAccSelectDisabled=false;
    //     }else{
    //       this.IsAccSelectDisabled = true;
    //     }
    //   }else{
    //     this.IsAccSelectDisabled = false;
    //   }
    // })
    this.accInfo = this.service.getacconts().pipe(share());
   // console.log("accinfo", this.accInfo);
    return this.accInfo;
  }

  getServices(acc: AccountInfo) {
    this.serviceInfo = this.service.getAllServicesbyAccount(acc.Value as string).pipe(share());
    return this.serviceInfo;
  }

  onAccountChange(acc: AccountInfo, event: any) {

    if (event.isUserInput) {

      this.accountchange(acc);
    }

  }

  accountchange(acc: AccountInfo) {
    // console.log(acc,'new account')
    this.selectedAccount = acc;
    this.selectedService = { Value: '-1', Text: '' };
    this.serviceInfo = new Observable<ServiceInfo[]>();

    if (acc) {
      this.getServices(acc);
      this.service.SelectedService = null;
    }

    this.service.SelectedAccount = this.selectedAccount;
  }


  onServiceChange(service: ServiceInfo, event: any) {
    if (event.isUserInput) {
      this.selectedService = service;
      this.service.SelectedService = this.selectedService;
    }
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }
}
