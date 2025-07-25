import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { parameterkeys, ConfigureModel } from '../../ConfigurationModel';
import { ToastrService } from "ngx-toastr";
import { ConfigureService } from '../../configure.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-api-test',
  templateUrl: './api-test.component.html',
  styleUrls: ['./api-test.component.scss'],
})

export class ApiTestComponent implements OnInit {
  private modalService: NgbModal;
  configuremodel: ConfigureModel;
  parametermodel: parameterkeys;
  url: any;
  UrlID: any;
  method_: any;
  date_format: any;
  content_type: any;
  proxy_s: any = false;
  success_response: any;
  failure_response: any;
  timeout: any;
  retry_count: any;
  proxy_: any;
  header_key1: any;
  header_keyvalue1: any;
  parameter_key1: any;
  parameter_keyvalue1: any;
  authentication: any;
  type: any;
  token: any;
  basic: any;
  header: any;
  request_body: any;
  isModalOpen: boolean;
  header_arr: any[] = [];
  parameter_arr: any[] = [];
  selectedValue: string;
  divVisibility: boolean[] = [false, false, false];
  displayStyle = "none";
  matDialog: any;

  constructor(/*public dialogRef: MatDialogRef<ApiTestComponent>,*/ private toastr: ToastrService, private configureService: ConfigureService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  //  this.name = data.properties.title;
  //  this.description = data.properties.Desc;
  //  this.apiNew = data.properties.api;
  //  this.method = data.properties.method;
  //  // this.content_type=data.properties.content_type;
  //  this.proxy = data.properties.proxy;
  //  this.authentication = data.properties.authentication;
  //  // this.type=data.properties.apiAuthConfig.Type;
  //  this.token = data.properties.apiAuthConfig.bearer;
  //  this.header_param = data.properties.apiAuthConfig.header;
  //  this.basic = data.properties.apiAuthConfig.basic;
  //  this.request_param = data.properties.request_param;
  //  this.response_param = data.properties.response_param;
  //  this.timeout = data.properties.timeout;
  //  this.retry = data.properties.retry;
  //  //this.currentFlow = this.flowEditservice.SelectedFlow;
  //  this.object_Id = data.id;
  //  // console.log("apicallobjdata",data);

  //  if (data.properties.content_type == 1) {
  //    this.content_type = "Application/JSON";
  //  } else if (data.properties.content_type == 2) {
  //    this.content_type = "Application/XML";
  //  } else if (data.properties.content_type == 3) {
  //    this.content_type = "Text/Plain";
  //  } else if (data.properties.content_type == 4) {
  //    this.content_type = "application/x-www-form-urlencoded";
  //  }

  //  if (data.properties.apiAuthConfig.Type == 1) {
  //    this.type = "Bearer";
  //  }
  //  if (data.properties.apiAuthConfig.Type == 2) {
  //    this.type = "Basic";
  //  }
  //  if (data.properties.apiAuthConfig.Type == 3) {
  //    this.type = "Header";
  //  }
  //  //console.log("type",this.type);
  //}

  //add_parameter(type) {
  //  var param = <Parameter>{ Name: "", Value: "" };
  //  if (type === 1) {
  //    this.request_param.push(param);
  //  } else if (type === 3) {
  //    this.header_param.push(param);
  //  }
  //}

  //delete_parameter(index, type) {
  //  if (type === 1) {
  //    this.request_param.splice(index, 1);
  //  } else if (type === 3) {
  //    this.header_param.splice(index, 1);
  //  }
  //}

  //apiTest() {
  //  var dataa = this.data;
  //  //  console.log("apicallobject",dataa);
  //  //var flowid = this.currentFlow.id;
  //  var objectid = this.object_Id;

  //  //  console.log("flowid",flowid);
  //  //  console.log("object_id",objectid);

  //  this.configureService.getApiTest(dataa, objectid).subscribe(
  //    (resp: any) => {
  //      if (resp.status.status == 1) {
  //        this.toastr.success("API Request Initiated!", "Success");
  //      } else {
  //        this.toastr.error(
  //          "API Request Failed. Please Check your input and try again.",
  //          "Error"
  //        );
  //      }
  //      var response = resp;
  //      var account_id = response.status.account_id;
  //      // console.log("account_id",account_id);
  //      var ref_id = response.status.ref_id;
  //      // console.log("reference_id",ref_id);

  //      // console.log("response1", response);
  //      this.response3 = undefined;
  //      this.post_date = "";
  //      this.response_date = "";
  //      if (response.status.message == "SUCCESS") {
  //        this.respCheckCount = 0;
  //        this.interval = setInterval(() => {
  //          this.respCheckCount = this.respCheckCount + 1;
  //          this.configureService.getResponse(account_id, ref_id).subscribe(
  //            (resp: any) => {
  //              var response = resp;
  //              //  console.log("response of API : ", response);

  //              //  console.log("message",response.status.response);
  //              this.response2 = response.status.response;

  //              this.response3 = "Please Wait for Response ...";
  //              if (response.status.status == 1) {
  //                this.response3 = JSON.stringify(this.response2).replace(
  //                  /\\/g,
  //                  ""
  //                );

  //                this.post_date = response.status.post_date;
  //                this.response_date = response.status.response_date;
  //                clearInterval(this.interval);
  //              }
  //            },
  //            (error) => {
  //              this.response3 = "";
  //              this.toastr.error(JSON.stringify(error), "failed");
  //            }
  //          );

  //          if (this.respCheckCount >= 60) {
  //            clearInterval(this.interval);
  //            if (this.response3 == "") this.response3 = "TimeOut";
  //          }
  //        }, 2000);
  //      }
  //    },
  //    (error) => {
  //      this.toastr.error(JSON.stringify(error), "failed");
  //    }
  //  );
  }

  ngOnInit(): void {
    //alert("popup");
    //this.dialogRef.updateSize("30%", "90%");
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  closePopup() { //close popup
    this.displayStyle = "none";
  }
}
