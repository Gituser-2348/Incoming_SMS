import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Build } from "./shared/app-enum.model";

@Injectable({
  providedIn: "root",
})
export class AppService {
 // buildName: any = Build.Banglalink;
  buildName: any = Build.Etisalat;
  //buildName: any = Build.Prutech;
  // buildName: any = "Banglalink"
  //buildName:any="Etisalat"
  // buildName:any="Vil"
  // buildName :any = "Airtel";
  defaultFlag: boolean;
  constructor(public http: HttpClient) {
    var root = <HTMLBaseElement>document.querySelector(":root");
    if (this.buildName === Build.Prutech) {
      // root.style.setProperty('--mainSidebar-active', '#1a8ee5');
      // root.style.setProperty('--mainSidebar-backgroundHover', '#20a8d8');
      root.style.setProperty(
        "--mainHeader-icon",
        `url(assets/img/brandImg/angle-left-solid.svg)`
      );
      root.style.setProperty(
        "--mainHeader-iconHover",
        `url(assets/img/brandImg/angle-left-solid.svg)`
      );
      // root.style.setProperty('--mainHeader-iconFilter', 'brightness(150.5)');
      // root.style.setProperty('--mainHeader-iconMargin', '-65px');
      // root.style.setProperty('--mainHeader-iconBright', 'brightness(0.5)');
      // root.style.setProperty('--mainHeader-iconBrightness', 'brightness(0.5)');

      // root.style.setProperty('--main-color', '#29a8df');
      // root.style.setProperty('--main-shade', 'linear-gradient(90deg, #2BA5DD 0%, #253E84 100%)');
      // root.style.setProperty('--main-sidebar', 'linear-gradient(#54bbea, #4bb4e5, #42acdf, #38a5da, #2e9ed4, #2890c6, #2282b8, #1c74aa, #195d90, #154776, #0f325d, #071e44)');
      // root.style.setProperty('--main-color-disabled', '#29a9df99');
      // root.style.setProperty('--main-color-hover', '#0db5fd');
      // root.style.setProperty('--main-sent-button-shade', 'linear-gradient(135deg, #2a27da, #00ccff)');
      // root.style.setProperty('--main-danger', '#f86c6b');
      // root.style.setProperty('--main-primaryDanger', '#1f729b');
      // // root.style.setProperty('--main-border','#29a8df7a');
      // root.style.setProperty('--main-shadow', '#29a8dfbf');
      // root.style.setProperty('--main-dangerHover', '#f52625');
    } else if (this.buildName === Build.Vil) {
      // root.style.setProperty('--mainSidebar-active', '#5F004B');
      // root.style.setProperty('--mainSidebar-backgroundHover', '#b90091');
      root.style.setProperty(
        "--mainHeader-icon",
        `url(assets/img/brandImg/angle-left-solid.svg)`
      );
      root.style.setProperty(
        "--mainHeader-iconHover",
        `url(assets/img/brandImg/angle-left-solid.svg)`
      );
      // root.style.setProperty('--mainHeader-iconFilter', 'brightness(126.5) sepia(1) saturate(0)');
      // root.style.setProperty('--mainHeader-iconMargin', '-65px');
      // root.style.setProperty('--mainHeader-iconBright', 'brightness(150.5)');
      // root.style.setProperty('--mainHeader-iconBrightness', 'brightness(150.5)');

      // root.style.setProperty('--main-select','#ffffff');
      root.style.setProperty("--main-label", "#ffffff");
      root.style.setProperty("--main-flowName", "#ffffff");
      // root.style.setProperty('--main-color', '#5F004B')
      // root.style.setProperty('--main-shade', 'linear-gradient(to bottom, #5F004B,#570044,#4b003b,#420034,#38002c,#2c0023)');
      // root.style.setProperty('--main-sidebar', 'linear-gradient(rgb(95, 0, 75), rgb(87, 0, 68), rgb(75, 0, 59), rgb(66, 0, 52), rgb(56, 0, 44), rgb(44, 0, 35))');
      // root.style.setProperty('--main-danger', '#f86c6b');
      // root.style.setProperty('--main-dangerHover', '#f52625');
      // root.style.setProperty('--main-shadow', '#5f004b94');
    } else if (this.buildName === Build.Etisalat) {
      root.style.setProperty("--main-color", "#719E19");
      root.style.setProperty("--main-label", "#ffffff");
      root.style.setProperty("--main-flowName", "#ffffff");
      root.style.setProperty("--main-color-dash", "#64833a");
    } else if (this.buildName === Build.Banglalink) {
      // root.style.setProperty('--mainSidebar-active', '#F7791E');
      // root.style.setProperty('--mainSidebar-backgroundHover', '#ff8833');
      root.style.setProperty("--main-color", "#F7791E"); 
      root.style.setProperty("--main-label", "#ffffff");
      root.style.setProperty("--main-flowName", "#ffffff");
     // --main - sidebar: linear - gradient(to bottom, #BED30B 10 %, #719E19 90 %);
    //  root.style.setProperty("--main-sidebar", " linear-gradient(to bottom, #BED30B 10%, #F7791E 90%);");
      root.style.setProperty(
        "--mainHeader-icon",
        `url(assets/img/brandImg/angle-left-solid.svg)`
      );
      root.style.setProperty(
        "--mainHeader-iconHover",
        `url(assets/img/brandImg/angle-left-solid.svg)`
      );
      // root.style.setProperty('--mainHeader-iconFilter', 'none');
      // root.style.setProperty('--mainHeader-iconMargin', '-50px');
      // root.style.setProperty('--mainHeader-iconBright', 'brightness(0.5)');
      // root.style.setProperty('--mainHeader-iconBrightness', 'brightness(0.5)');
      root.style.setProperty('--main-color-hover', '#F7791E');
      root.style.setProperty('--mainSidebar-active', '#F7791E');
      root.style.setProperty('--mainSidebar-backgroundHover', '#F7791E');
      root.style.setProperty("--main-color-dash", "#92cb1f");
      //--mainSidebar - active: #719E19;
      //--mainSidebar - backgroundHover: #719E19;
       root.style.setProperty('--main-sidebar', 'linear-gradient(rgb(245, 130, 32), rgb(95, 30, 0))');
      // root.style.setProperty('--main-color', '#F58220');
      // root.style.setProperty('--main-border', '#C84D23');
      // root.style.setProperty('--main-shadow', '#f582209e');
      // root.style.setProperty('--main-shade', 'linear-gradient(#F58220,#5F1E00)');
      // root.style.setProperty('--main-dangerHover', '#C84D23');
      // root.style.setProperty('--main-danger', '#5F1E00');
    } else if (this.buildName === Build.Airtel) {
      root.style.setProperty(
        "--mainHeader-icon",
        `url(assets/img/brandImg/angle-left-solid.svg)`
      );
      root.style.setProperty(
        "--mainHeader-iconHover",
        `url(assets/img/brandImg/angle-left-solid.svg)`
      );
      root.style.setProperty("--main-label", "#ffffff");
      root.style.setProperty("--main-flowName", "#ffffff");
    }
  
  }
  

   navData = [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: "bi bi-clipboard-data",
    },
    {
      name: "Manage VMN",
      url: "/ManageVMN",
      icon: "bi bi-chat-right-fill",
    },
    {
      name: "Configuration",
      url: "/Configuration",
      icon: "fa fa-cogs",
    },
    {
      name: "Report",
      url: "/Report",
      icon: "bi bi-file-earmark-text",
      children: [
        {
          name: "VMN List",
          url: "/Report/VMNList",
          icon: "bi bi-person-circle ml-3",
        },
        {
          name: "Summary",
          url: "/Report/Summary",
          icon: "bi bi-list-columns-reverse ml-3",
        },
        {
          name: "Detailed",
          url: "/Report/Detailed",
          icon: "bi bi-arrow-right-circle-fill ml-3",
        },
      ],
    },
  ];

   navData_enduser = [
    {
      name: "Reports",
      url: "/EndUser",
      icon: "bi bi-clipboard-data",
      children: [
        {
          name: "VMN List",
          url: "/EndUser/vmnlist",
          icon: "fa fa-cogs",
        },
        {
          name: "Summary",
          url: "/EndUser/SummaryReport",
          icon: "bi bi-chat-right-fill",
        },
        {
          name: "Detailed",
          url: "/EndUser/DetailedReport",
          icon: "bi bi-clipboard-data",
        },
      ],
    },
  ];
}
