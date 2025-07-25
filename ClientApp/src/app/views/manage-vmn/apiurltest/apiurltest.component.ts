



import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ManagevmnService } from '../manage-vmn/managevmn.service';
import { InserturltestModel, vmndropdown } from '../manage-vmnModel';
import { vmnchangestatusmodel } from '../manage-vmnModel';
import { SigninService } from '../../sign-in/sign-in.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';

import { Injectable, ViewContainerRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';




import { ToastrService } from 'ngx-toastr';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ConfigureService } from '../../configurarion/configure.service';
import { ConfigurarionComponent } from '../../configurarion/configurarion.component';
import { ConfigureModel, parameterkeys } from '../../configurarion/ConfigurationModel';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-apiurltest',
  templateUrl: './apiurltest.component.html',
  styleUrls: ['./apiurltest.component.scss']
})
export class ApiurltestComponent implements OnInit {
  url_: any; is_show_status: any; interval: any; respCheckCount: number;
  method_: any; response2 = ""; response3 = "";
    content_type: number;
  date_format: any; timeout_b: any;
  authentication_: any; is_url_fetch: boolean = true;
  proxy_: any; cot: number = 0;
  timeout: any; is_show_date: boolean = true;
    retry_count: any;
  failure_response: any; url_responsedummy: any = 'gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg';
    success_response: any;
    header_arr: any[]=[];
    header_key1: any;
    header_keyvalue1: any;
    parameter_key1: any;
    parameter_arr: any[]=[];
    parameter_keyvalue1: number;
  parameter_final_arr: any[] = []; Bearer_token: any; Basic_auth: any; url_id: any; insert_parameter_model: InserturltestModel;
  url_status: any; url_response: any;
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: any, private config_service: ConfigureService , private mngvmnservice: ManagevmnService, private snackBar: MatSnackBar, private spinner: NgxSpinnerService) { }
  
  ngOnInit(): void {
    this.spinner.hide();
    this.is_show_status=true;
  //  console.log('dialog data', this.dialogData);
    const response = this.dialogData.response[0];
    this.url_id = this.dialogData.url_id;
   // console.log('response', response, 'url_id', this.url_id);
    this.method_ = response.Method;
    this.url_ = response.Url;
    this.content_type = response.Content_type;
    this.proxy_ = response.Proxy;
    this.timeout = response.Time_Out;
    this.retry_count = response.Retry_Count;
    this.authentication_ = response.authentication;
    this.Bearer_token = response.Bearer_Token_Value;
    this.Basic_auth = response.Basic_Auth_Value;
    this.date_format = response.Date_Format;
   // console.log('this.date_format', this.date_format);
    if (this.date_format === null || this.date_format === "" || this.date_format === 0 || this.date_format === '0') {
      this.is_show_date = false;
    } else {
      this.is_show_date = true;
    }
    this.parameter_arr = JSON.parse(response.Request_Parameters);
    this.header_arr = JSON.parse(response.Header_KeyValue);
   // console.log('parameetr_arr', this.parameter_arr);
   // console.log('header_arr', this.header_arr);
    if (response.authentication == null || response.authentication == '' || !response.authentication) {
      this.authentication_ = 'None';
    }

    for (let i = 1; i <= 10; i++) {
      const parameterKey = this.parameter_arr[0][`parameter${i}`];
      let parameterValue = this.parameter_arr[0][`value${i}`];
     
      if (parameterKey === null || parameterValue === null || parameterKey === '' || parameterValue === '' ||
        typeof parameterKey === 'undefined' || typeof parameterValue === 'undefined') {

        break; // Exit the loop
      }

      
      //if (isNaN(parameterValue)) {
      //  parameterValue = '10';
      //}

      const newItem = {
        parameter_key: parameterKey,
        
        
      };
      this.parameter_final_arr.push(newItem);

    }





  }


  closeDialog() {
    
    this.is_url_fetch = false;
  }
  send_() {
    this.is_url_fetch = true;
    this.spinner.show();
    let val_flag = '0';
    for (let m = 0; m < this.parameter_final_arr.length; m++) {
      if (!this.parameter_final_arr[m].parameter_value || this.parameter_final_arr[m].parameter_value.trim() === '') {
        val_flag = '1';
        break;
      }
    }



    if (val_flag == '0') {
     // console.log('send()');
     // console.log('parameter array', this.parameter_final_arr);
      let req_body = {};
      for (let i = 0; i < this.parameter_final_arr.length; i++) {
        req_body[this.parameter_final_arr[i].parameter_key] = this.parameter_final_arr[i].parameter_value;
      }
      const params: parameterkeys = new parameterkeys();
      for (let i = 0; i < this.parameter_final_arr.length; i++) {
        const { parameter_key, parameter_value } = this.parameter_final_arr[i];
        const propName = `parameter${i + 1}`;
        const valueName = `value${i + 1}`;
       
          params[propName] = parameter_key;
        params[valueName] = parameter_value;
        
      }
     // console.log('params', params);
      let req_body_json = JSON.stringify(req_body);
     // console.log('req_body', req_body_json);
      this.insert_parameter_model = new InserturltestModel();
      this.insert_parameter_model.data = req_body_json; this.insert_parameter_model.UrlID = this.url_id; this.insert_parameter_model.parameters = JSON.stringify(params);
      const request_body = JSON.stringify(this.insert_parameter_model);


     
      this.config_service.UrlTestResponse(request_body).subscribe((resp: any[]) => {
        this.spinner.hide();
      //  console.log('uri resp', resp);

        if (resp[0].urlcaller_urlid == '' || !resp[0].urlcaller_urlid || resp[0].urlcaller_urlid == 0 || resp[0].urlcaller_urlid == '0') {
          // this.toastr.error(JSON.stringify(resp[0].response), "failed");


        }
        else {
          var url_id = resp[0].urlcaller_urlid;
          var respo = JSON.stringify(resp[0].response).replace(
            /\\/g,
            "");
         // console.log('respo', respo);
          if (resp[0].status == "0" || respo == "Url ID not found") {
            this.url_response = "Please Wait for Response ...";
            this.recursiveAPITestResponse(url_id);
           // console.log('athis.response3', this.response3);

          }

          else {
            this.respCheckCount = this.respCheckCount + 1;
            this.response2 = resp[0].response;
            this.url_response = "Please Wait for Response ...";
            // this.toastr.error(JSON.stringify(this.response2), "failed");

          }



        }


      }, (error) => {
        this.response3 = "";
        //this.toastr.error(JSON.stringify(error), "failed");
      });
      

      //this.mngvmnservice.InsertTestUrlDetails(request_body).subscribe((resp: any[]) => {
      //  this.spinner.hide();
      //  if (resp[0].status == '1') {
      //    this.is_show_status = false;
      //    this.url_status = resp[0].url_status;
      //    this.url_response = resp[0].url_response;


      //  }
      //  else {
      //    this.snackBar.open(resp[0].response, 'error', { duration: 10000 });
      //    this.is_show_status = false;
      //    this.url_status = resp[0].url_status;
      //    this.url_response = 'Failed';
      //  }
      //});
    }
    else {
      this.spinner.hide();
      this.snackBar.open('Parameter value cannot empty', '! Warning', { duration: 10000 });

    }
    
  }
 
  private recursiveAPITestResponse(url_id: string): void {

    if (this.is_url_fetch) {
      this.cot = 0;
    }
   
    var req_body = "{\"UrlID\":\"" + url_id + "\"}";

    this.config_service.APITestResponse(req_body).subscribe((resp: any) => {
     // console.log('2 response', resp);
      if (resp.status == "1" || resp.status == 1) {
        // alert('if');
        //this.response3 = JSON.stringify(resp[0].url_response).replace(
        //  /\\/g,
        //  ""
        //);
        this.url_response = resp.url_response;
        this.url_status = resp.url_status;
       // console.log('wthis.response3', this.response3);
      } else {
        // alert('else');
        // this.toastr.error(JSON.stringify('didnt get resp'), "failed");
        // Set an interval to call recursiveAPITestResponse after a delay
        this.cot = this.cot + 1;
        if (this.cot < 20) {

          this.recursiveAPITestResponse(url_id);
        }


        // Adjust the delay as needed (e.g., 2000 milliseconds)
      }
    });
  }



  apiTest() {
    


    //  this.config_service.UrlTestResponse(this.request_body).subscribe((resp: any[]) => {
    //    this.spinner.hide();
    //    console.log('uri resp', resp);

    //    if (resp[0].urlcaller_urlid == '' || !resp[0].urlcaller_urlid || resp[0].urlcaller_urlid == 0 || resp[0].urlcaller_urlid == '0') {
    //     // this.toastr.error(JSON.stringify(resp[0].response), "failed");


    //    }
    //    else {
    //      var url_id = resp[0].urlcaller_urlid;
    //      var respo = JSON.stringify(resp[0].response).replace(
    //        /\\/g,
    //        "");
    //      console.log('respo', respo);
    //      if (resp[0].status == "0" || respo == "Url ID not found") {
    //        this.response3 = "Please Wait for Response ...";
    //        this.recursiveAPITestResponse(url_id);
    //        console.log('athis.response3', this.response3);
           
    //      }

    //      else {
    //        this.respCheckCount = this.respCheckCount + 1;
    //        this.response2 = resp[0].response;
    //        this.response3 = "Please Wait for Response ...";
    //       // this.toastr.error(JSON.stringify(this.response2), "failed");
            
    //      }



    //    }


    //  }, (error) => {
    //    this.response3 = "";
    //    //this.toastr.error(JSON.stringify(error), "failed");
    //  });

      
    }
  }

  
//}
