import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { AppConfig } from '../../../core/AppConfig/app.config';

import { EncdeccryptoService } from '../../../shared/encdeccrypto.service';
import { ManageAccServiceService } from '../../../core/manage-acc-service/manage-acc-service.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class ManagevmnService {

 
 baseURL = AppConfig.Config.api.sms;
 //baseURL = '/IncomingSMS/';
  //baseURL = AppConfig.Config.url;
  // console.log("JSON Data" + data);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
    responseType: 'json' as const
  };
  constructor(private http: HttpClient, private manageaccservice: ManageAccServiceService,
    private enc: EncdeccryptoService) {
  }
  GetVmnDropdown() {
   // console.log("GetVmnDropdown list service");

    return this.http.post(this.baseURL + 'api/ManageVMN/VMNDropdown', this.httpOptions);
  }
  GetVmntable(VMN:any) {
   // console.log("GetVmntable table service");
    const req_body = { "VMN": VMN };
   // console.log(JSON.stringify(req_body));

    return this.http.post(this.baseURL + 'api/ManageVMN/VMNTable', JSON.stringify(req_body), this.httpOptions);
  }
  
  GetStatusRemarktable(VMN: any) {
   // console.log("GetStatusRemarktable table service");
    const req_body = { "VMN": VMN };
  //  console.log(JSON.stringify(req_body));

    return this.http.post(this.baseURL + 'api/ManageVMN/StatusRemarkTable', JSON.stringify(req_body), this.httpOptions);
  }

  GetChangeStatusInfo(VMN: any) {
  //  console.log("GetChangeStatusInfo table service");
    const req_body = { "VMN": VMN };
  //  console.log(JSON.stringify(req_body));

    return this.http.post(this.baseURL + 'api/ManageVMN/GetStatusInfo', JSON.stringify(req_body), this.httpOptions);
  }
  Changevmnstatus(req_body:any) {
   // console.log("Changevmnstatus  service");
  //  console.log(req_body);
  //  console.log(JSON.stringify(req_body));

    return this.http.post(this.baseURL + 'api/ManageVMN/VMNStatusChange', req_body, this.httpOptions);
  }
  ChangeUrlInfo(VMN: any) {
  //  console.log("GetChangeStatusInfo table service");
    const req_body = { "VMN": VMN };
  // console.log(JSON.stringify(req_body));

    return this.http.post(this.baseURL + 'api/ManageVMN/ChangeUrlInfo', JSON.stringify(req_body), this.httpOptions);
  }
  UrlChange(request_body: any) {
   // console.log("UrlChange in service ");

    return this.http.post(this.baseURL + 'api/ManageVMN/UrlChange', request_body, this.httpOptions);
  }
  UrlChangeTestInsert(request_body: any) {
   // console.log("UrlChangeTestInsert in service ");

    return this.http.post(this.baseURL + 'api/ManageVMN/UrlChangeTestInsert', request_body, this.httpOptions);
  }
  InsertTestUrlDetails(request_body: any) {
   // console.log("InsertTestUrlDetails in service ");

    return this.http.post(this.baseURL + 'api/ManageVMN/InsertTestUrlDetails', request_body, this.httpOptions);
  }
}
//////


