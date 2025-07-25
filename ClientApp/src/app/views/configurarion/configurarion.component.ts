import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
//import { SmsService } from '../smsservice/sms.service';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ConfigureService } from './configure.service';
import { MatTabGroup } from '@angular/material/tabs';
import { ViewChild } from '@angular/core';
import { vmnlist } from './ConfigurationModel';
import { UrlComponent } from './url/url.component';
import { RequestComponent } from './request/request.component';

@Component({
  selector: 'app-configurarion',
  templateUrl: './configurarion.component.html',
  styleUrls: ['./configurarion.component.scss'],
 
})

export class ConfigurarionComponent implements OnInit {
  
  @ViewChild(RequestComponent) requestComponent: RequestComponent;
  globalMenuId: string = ""; actual_vmn_json: Array<vmnlist> = [];
  info_rid: any; url_info: boolean = false; url_no_vmn = true; is_show_vmn_save: boolean = false;
  show_status: any = 0;
  CampaignSelectFlag: boolean = false;
  campaignmanageFlag: boolean = false;
  createCampaignData: any;
  baseUploadData: any;
  info_customer_name: any='';
  constructor(private config_service: ConfigureService, private renderer: Renderer2) {
    //alert('configcomponent');
  }
  ngAfterViewInit() {
    const tabLabels = document.querySelectorAll('.mat-tab-label');

    tabLabels.forEach((tabLabel) => {
      this.renderer.setStyle(tabLabel, 'background-color', '#719e19');
      this.renderer.setStyle(tabLabel, 'color', 'white');
    });
  }
  handleConditionMet() {
    this.requestComponent.executeFunction();
  }
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  masterMenuIdArray = [
    "Request",
    "Info",
    "Numbers",
    "Url",
    "WebUser"
  ];
  info_clicked() {
    alert('info_clicked');
    //alert(this.info_rid);

  }



  ngOnInit() {
    /*this.globalMenuId = "Request";*/
    //alert('configcomponent');
    this.info_rid = '0';
    this.config_service.tabChange$.subscribe(index => {
      this.tabGroup.selectedIndex = index;
    });
  }
}

