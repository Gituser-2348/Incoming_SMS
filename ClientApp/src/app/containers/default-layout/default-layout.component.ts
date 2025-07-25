import { Component, HostListener } from '@angular/core';
import { smsOperator } from '../../_nav';
import { CommonService } from '../default-service/common.service';
import { interval, Observable, Subscription } from 'rxjs';
import { AppConfig } from '../../core/AppConfig/app.config';
import { LoginService } from './../../core/services/login.service';
import { AuthService } from '../../core/services/auth.service';
import { ManageAccServiceService } from '../../core/manage-acc-service/manage-acc-service.service';
import { LocationStrategy } from '@angular/common';
import { FlowbuilderService } from '../../views/flow/flowbuilder.service';
import { Router } from '@angular/router';
import { SwPush } from '@angular/service-worker';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { AppService } from '../../app.service';
import { SigninService } from '../../views/sign-in/sign-in.service';
//import { AccountsService } from '../../views/accounts/accounts.service';
import { Build } from '../../shared/app-enum.model';
import { INavData } from "@coreui/angular";

@Component({
  selector: "app-dashboard",
  templateUrl: "./default-layout.component.html",
})
export class DefaultLayoutComponent {
  userName: any;
  private readonly publicKey =
    "BDBOu5nMJjJwm5DTS-Ed2Yrxc6UhwNT7AhY0GZLoH9WEdcamHr5NZsQSwGwC5XslCLNoxZExTNNEHA3qeFSwPTQ";
 baseURL = AppConfig.Config.api.sms;
 // baseURL = '/IncomingSMS/';
 // baseURL = AppConfig.Config.url;
  httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }),
    responseType: "json" as const,
  };
  public sidebarMinimized = false;
  public navItems = []; // navItems;

  // SecQuestion=Array<AccountInfo>();
  // accInfo: any;
  ///  accInfo=Array<SecQuestionddl>();
  //serviceInfo: Observable<ServiceInfo[] | undefined>;
  flowName: any;
  id: string;
  Companyname: string;
  address: string;
  accounttype: string;
  channel: string;
  phone: string;
  Companytype: string;
  inserted: string;
  update_on: string;
  credit: string;
  balance: string;
  usedcredit: string;
  principalentityid: string;
  otptype: string;
  otptypeid: number;
  spocname: string;
  email: string;
  apiurl: string;
  longcodenum: string;
  usedPercent: number = 0;
  RoleID: any;
  modularSidebar: any = "";
  subscription: Subscription;
  data: any;
  selectedAccount: any;
  accDisable: boolean = false;
  footerHref: any;
  footerName: any;
  headerStyle: any;
  sidebarStyle: any;
  agentWindow: boolean = false;
  brandMin: any;
  buildName: any = "Acp";
  globalNav: any = "";
  globalnavv_enduser: any = "";
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
  constructor(
    private appService: AppService,
    private http: HttpClient,
    private Service: CommonService,
    private router: Router,
    private loginService: LoginService,
    private flowbuilder: FlowbuilderService,
    private service: ManageAccServiceService,
    private location: LocationStrategy,
    private authService: AuthService,
    private swpush: SwPush,
    private signInService: SigninService,
    //private accService: AccountsService
  ) {
    appService.defaultFlag = false;
    sessionStorage.setItem(
      "defaultFlag",
      this.signInService.encryptData("false")
    );
  }

  @HostListener("window:unload", ["$event"])
  unloadHandler(event) {
  //  this.accService.updateHealthFlagDB(0).subscribe((data) => {});
  }

  ngOnInit(): void {
    this.globalNav = this.appService.navData;
    this.globalnavv_enduser = this.appService.navData_enduser;
    this.userName = this.signInService.decryptData(
      sessionStorage.getItem("UserName")
    );

    if (
      this.signInService.decryptData(sessionStorage.getItem("RoleID")) == "5"
    ) {
      this.pushSubscription();
    }
    this.swpush.messages.subscribe((data) => {
      // console.log(data,'message');
    });

    this.service.refresh.subscribe((data) => {
      // console.log("refresh", data);
      if (data == "close") {
        this.sidebarMinimized = true;
        var sidebar = document.getElementsByTagName("app-sidebar-nav");
        sidebar[0].classList.add("displayNone");
        var element = document.getElementById("body");
        if (element.classList.contains("sidebar-minimized")) {
          element.classList.remove("sidebar-minimized");
        }
        if (element.classList.contains("sidebar-lg-show")) {
          element.classList.remove("sidebar-lg-show");
          var element1 = document.getElementsByClassName("navbar-toggler-icon");
          // console.log(element1, 'element1');
          setTimeout(() => {
            element1[1].classList.add("navbar-toggler-icon-rotate");
          }, 100);
        }
      } else if (data == "open") {
        var element = document.getElementById("body");
        this.sidebarMinimized = false;
        if (element.classList.contains("brand-minimized")) {
          element.classList.remove("brand-minimized");
        }
        if (!element.classList.contains("sidebar-lg-show")) {
          element.classList.add("sidebar-lg-show");
          var elementOne = document.getElementsByClassName(
            "navbar-toggler-icon-rotate"
          );
          setTimeout(() => {
            elementOne[0].classList.remove("navbar-toggler-icon-rotate");
          }, 100);
        }
        var sidebar = document.getElementsByTagName("app-sidebar-nav");
        if (sidebar[0].classList.contains("displayNone")) {
          sidebar[0].classList.remove("displayNone");
        }

        // var elementOne=document.getElementsByClassName('navbar-toggler-icon-rotate')

        // if(elementOne[0].classList.contains('navbar-toggler-icon-rotate')){
        //   elementOne[0].classList.remove('navbar-toggler-icon-rotate')
        // }
      }
    });

    this.flowbuilder.flowName.subscribe((data) => {
      this.flowName = data;
    });
    if (this.flowbuilder.reload == 1) {
      this.flowbuilder.reload = 0;
      window.location.reload();
    }
    // sessionStorage.setItem('RoleID','5')
    this.RoleID = this.signInService.decryptData(
      sessionStorage.getItem("RoleID")
    );
    //alert(this.RoleID);
    this.modularSidebar = this.signInService.decryptData(
      sessionStorage.getItem("modularity")
    );
    this.flowbuilder.flowName.subscribe((name) => {
      // console.log(name, "flowName")
      this.flowName = name;
    });
    const body = document.body;
    if (body.classList.contains("sidebar-lg-show")) {
    }
    // if (this.RoleID == "1") {
    //   this.navItems = navItemsSMSSuperAdmin;
    // }
    // this.navItems = smsOperator;
    this.preventBackButton();

    //emit value in sequence every 10*6*5 second
    // const source = interval(10000 * 6 * 5);
    // this.subscription = source.subscribe(val => this.bindUserInfo());
    if (this.appService.buildName == Build.Prutech) {
      this.brandMin = {src: 'assets/img/brandImg/MinimizedLogo.JPG', width: 56, height: 56}
      this.footerHref = 'https://prutech.in/';
      this.footerName = "Prutech"
      this.headerStyle = 'background-color: #F7F8FC;'
      this.sidebarStyle = "background-image: linear-gradient(to bottom, #54bbea, #4bb4e5, #42acdf, #38a5da, #2e9ed4, #2890c6, #2282b8, #1c74aa, #195d90, #154776, #0f325d, #071e44);"
    } else if (this.appService.buildName == Build.Vil) {
      this.brandMin = {src: 'assets/img/brandImg/MinimizedLogo.jpg', width: 50, height: 48}
      this.footerHref = 'https://www.myvi.in/';
      this.footerName = "Vi"
      this.headerStyle = 'background-color: #F7F8FC; border: 0px !important; background-color:#5F004B !important;'
      this.sidebarStyle = "background-image: linear-gradient(to bottom, #5F004B,#570044,#4b003b,#420034,#38002c,#2c0023) !important;"
    } else if (this.appService.buildName == Build.Etisalat) {
      this.footerHref = 'https://www.etisalat.ae/';
      this.footerName = "Etisalat"
      this.headerStyle = 'background-color: #F7F8FC;'
      this.sidebarStyle = "background: linear-gradient(to bottom, #94ce20 0%, #47630f 100%) !important;"
    } else if (this.appService.buildName == Build.Banglalink) {
      this.brandMin = {src: 'assets/img/brandImg/MinimizedLogoSvg.svg', width: 38, height: 38}
      this.footerHref = 'https://www.banglalink.net/';
      this.footerName = "Banglalink"
      this.headerStyle = 'background-color: #F7F8FC;'
      this.sidebarStyle = "background: linear-gradient(#F58220,#5F1E00) !important;"
    } else if (this.appService.buildName == Build.Airtel) {
      this.brandMin = {src: 'assets/img/brandImg/MinimizedLogoSvg.svg', width: 38, height: 38}
      this.footerHref = 'https://www.airtel.co.ug/';
      this.footerName = "Airtel"
      this.headerStyle = 'background-color: #F7F8FC;'
      this.sidebarStyle = "background: linear-gradient(#FE0000,#B90000) !important;"
    }

    let navigationItems: INavData[] = [];
    if (this.RoleID == 3) {
      navigationItems = this.globalnavv_enduser;
    } else {
      navigationItems = this.globalNav;
    }

    // Set the navigation items
    this.navItems = navigationItems;
    //this.createModularSideBar();
  }
  isHomeRoute() {
    return (
      this.router.url === "/flow/flow" ||
      this.router.url === "/flow/flowpreview"
    );
  }

  pushSubscription() {
    if (!this.swpush.isEnabled) {
      // console.log('notification not enabled');
      return;
    }
    this.swpush
      .requestSubscription({
        serverPublicKey: this.publicKey,
      })
      .then((sub) =>
        this.sendNotification(JSON.stringify(sub)).subscribe((data) => {
          console.log(data, "res");
        })
      )
      .catch((err) => console.log(err));
  }

  sendNotification(sub) {
    return this.http
      .post(this.baseURL + "api/webpush/webpush", sub, this.httpOptions)
      .pipe(retry(2));
  }

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, location.href);
    });
  }

  logout() {
    this.preventBackButton();
    sessionStorage.setItem("IsLoggedIn", "false");
  const ssoURL = AppConfig.Config.api.sms;
  // const ssoURL = '/IncomingSMS/';
  //const  ssoURL = AppConfig.Config.url;
    
    const AppName = AppConfig.Config.appName;
    var LoginID = this.signInService.decryptData(sessionStorage.getItem('LoginID'));
    this.signInService.logout(LoginID, 0).subscribe((resp) => {
      window.sessionStorage.clear();
      sessionStorage.setItem('IsLoggedIn', "false");
      window.location.href = ssoURL;
    }, error => {
      console.log("Logout 2: ", error);
      window.sessionStorage.clear();
      sessionStorage.setItem('IsLoggedIn', "false");
      window.location.href = ssoURL;
    });
  }

  //createModularSideBar() {
  //  if (this.RoleID == 3) {
  //    let modularJSON = {
  //      100: 1,
  //      110: 1,
  //      120: 1,
  //      130:1
        
  //    };
  //    let navMapping = {}
  //    let nav: INavData[] = [
  //      {
  //        divider: true,
  //      },
  //    ];
  //    for (const obj in modularJSON) {
  //      //console.log(obj);
  //      //console.log(modularJSON[obj]);
  //      if (modularJSON[obj] == 1) {
  //        let parentIndex = parseInt(obj.split("")[0]);
  //        //console.log(parentIndex);
  //        let childIndex = parseInt(obj.split("")[1]);
  //        //console.log(childIndex);
  //        if (childIndex != 0) {
  //          // nav[parentIndex].children.splice(
  //          //   childIndex - 1,
  //          //   0,
  //          //   this.globalNav[obj]
  //          // );
  //          nav[navMapping[parentIndex + '00']].children.splice(
  //            childIndex - 1,
  //            0,
  //            this.globalnavv_enduser[obj]
  //          );
  //        } else {
  //          // nav.splice(parentIndex, 0, this.globalNav[obj]);
  //          nav.push(this.globalnavv_enduser[obj])
  //          navMapping[obj] = nav.length - 1
  //        }
  //        // console.log(nav, "Nav");
  //      }
  //    }
  //    this.navItems = nav;
  //  }  else {
  //    let modularJSON = {
  //      100: 1,
  //      200: 1,
  //      300: 1,
  //      400: 1,
  //      410: 1,
  //      420: 1,
  //      430: 1
  //    };
  //    let navMapping = {}
  //    let nav: INavData[] = [
  //      {
  //        divider: true,
  //      },
  //    ];
  //    for (const obj in modularJSON) {
  //      //console.log(obj);
  //      //console.log(modularJSON[obj]);
  //      if (modularJSON[obj] == 1) {
  //        let parentIndex = parseInt(obj.split("")[0]);
  //        //console.log(parentIndex);
  //        let childIndex = parseInt(obj.split("")[1]);
  //        //console.log(childIndex);
  //        if (childIndex != 0) {
  //          // nav[parentIndex].children.splice(
  //          //   childIndex - 1,
  //          //   0,
  //          //   this.globalNav[obj]
  //          // );
  //          nav[navMapping[parentIndex + '00']].children.splice(
  //            childIndex - 1,
  //            0,
  //            this.globalNav[obj]
  //          );
  //        } else {
  //          // nav.splice(parentIndex, 0, this.globalNav[obj]);
  //          nav.push(this.globalNav[obj])
  //          navMapping[obj] = nav.length - 1
  //        }
  //        // console.log(nav, "Nav");
  //      }
  //    }
  //    this.navItems = nav;
  //  }
    
  //}

  ngOnDestroy() {
   // this.accService.updateHealthFlagDB(0).subscribe((data) => {});
  }
}
