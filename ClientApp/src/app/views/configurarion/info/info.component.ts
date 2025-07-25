import { Component, OnInit } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ConfigureService } from '../configure.service';
import { ConfigurarionComponent } from '../configurarion.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})

export class InfoComponent implements OnInit
{
  infoData: any; is_show_info: boolean = true;
  ReqID: any; is_show_err_no_data: boolean = false; is_show_req_id: boolean = true;
  Request_ID: any;
  Circle_Name: any;
  Customer_Name: any;
  Plan_Type: any; is_show_url_info: boolean = false;
  Plan_Name: any;
  Incoming_SMS_Service: any;
  Outgoing_SMS_Service: any;
  Incoming_SMS: any;
  Reporting_Mode: any;
  Suggested_Platform: any;
  ini_id: any = "";
  config_: ConfigurarionComponent;
  constructor(private config_service: ConfigureService, private conf: ConfigurarionComponent, private snackBar: MatSnackBar, private toastr: ToastrService) {
    this.config_ = conf;
    this.config_service.tabChange$.subscribe(index => {
      if (index === 1) { // when click on configure of request table
        // Perform actions specific to the "Info" tab
        this.ngOnInit(); // Call ngOnInit explicitly when the tab is changed
      }
    });
  }
  onInputKeyDown(event: KeyboardEvent): void {
    const inputElement = this.ReqID.nativeElement;
    const currentValue = Number(inputElement.value);
    const step = Number(inputElement.step);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const newValue = currentValue - step;
      if (newValue >= 0) {
        this.ReqID = newValue;
      }
    }
  }
  save_() {

    this.config_service.changeTab(2);
  }
  pre_back() {

    this.config_service.changeTab(0);
  }
  ngOnInit(): void {
   /* alert('info ngonint');*/
    this.config_service.data$.subscribe(data => {
      this.infoData = data;
     // console.log(this.infoData); // Print the value in the console or perform any other operations
    });
    this.ini_id = this.config_.info_rid;
    /* alert('ng on init()-->this.ini_id' + this.ini_id);*/
    if (this.ini_id == 0 || this.ini_id == '') {
      this.is_show_info = false;
      this.is_show_err_no_data = true;
      this.is_show_req_id = false;

    } else {
      this.is_show_info = true;
      this.is_show_err_no_data = false;
      this.ReqID = this.ini_id;
      this.is_show_req_id = true;
      this.GetInfo(this.ini_id);
    }
    
  }

  GetInfo(Req_ID: any) {
   /* alert('getinfo()' + Req_ID);*/
  //  console.log("info ts  get info()");
   // console.log(Req_ID);
    this.config_service.getInfoTable(Req_ID).subscribe((resp: any[]) => {
    //  console.log('resr',resp);
    //  console.log(resp.length);
      if (resp.length > 0) {
        const firstItem = resp[0];
        this.Request_ID = firstItem.Request_ID;
        this.Circle_Name = firstItem.Circle;
        this.Customer_Name = firstItem.Customer;
        this.Plan_Name = firstItem.PlanName;
        this.Plan_Type = firstItem.PlanType;
        this.Incoming_SMS_Service = firstItem.Services;
        this.Suggested_Platform = firstItem.SuggestedPlatform;

        // You can assign other properties as needed

     //   console.log(this.Request_ID);
      }
      
    });
  }
  GetInfo1(Req_ID: any) {
    /* alert('getinfo()' + Req_ID);*/
  //  console.log("info ts  get info()");
  //  console.log(Req_ID);
    this.config_service.getInfoTable(Req_ID).subscribe((resp: any[]) => {
     // console.log('resr', resp);
    //  console.log(resp.length);
      if (resp.length > 0) {
        const firstItem = resp[0];
        this.Request_ID = firstItem.Request_ID;
        this.Circle_Name = firstItem.Circle;
        this.Customer_Name = firstItem.Customer;
        this.Plan_Name = firstItem.PlanName;
        this.Plan_Type = firstItem.PlanType;
        this.Incoming_SMS_Service = firstItem.Services;
        this.Suggested_Platform = firstItem.SuggestedPlatform;

        // You can assign other properties as needed

      //  console.log(this.Request_ID);
      }
      else {
        const errorMessage = 'Invalid Request ID found. Please select a request for view details';
        this.toastr.error(errorMessage, 'Error');
        this.config_service.changeTab(0);
      }
    });
  }

  req_search() {
    this.GetInfo1(this.ReqID.toString());
  }
}
