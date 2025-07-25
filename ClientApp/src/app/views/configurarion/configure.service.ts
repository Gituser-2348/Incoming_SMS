import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { AppConfig } from '../../core/AppConfig/app.config';
import { ManageAccServiceService } from '../../core/manage-acc-service/manage-acc-service.service';
import { EncdeccryptoService } from '../../shared/encdeccrypto.service';
import { RequestModel, UrlTestRespParameter } from './ConfigurationModel';
import { Subject } from 'rxjs';
import { UrlComponent } from './url/url.component';


@Injectable({
  providedIn: 'root'
})

export class ConfigureService {
  url_component_: UrlComponent;
baseURL = AppConfig.Config.api.sms;
// baseURL = '/IncomingSMS/';
 // baseURL = AppConfig.Config.url;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
    responseType: 'json' as const
  };
  private tabChangeSubject = new Subject<number>();
  private dataSubject = new Subject<any>();
  private booleanSubject = new Subject<boolean>();

  setBooleanValue(value: boolean) {
    this.booleanSubject.next(value);
  }

  getBooleanObservable() {
    return this.booleanSubject.asObservable();
  }

  tabChange$ = this.tabChangeSubject.asObservable();
  data$ = this.dataSubject.asObservable();

  changeTab(index: number): void {
    this.tabChangeSubject.next(index);
  }

  setData(data: any): void {
    this.dataSubject.next(data);
  }

  chang_to_3() {
    alert();
    
    //this.setBooleanValue(this.url_component_.is_show_err_no_data_vmn = false);
    //this.setBooleanValue(this.url_component_.is_show_url_info = true);
    //this.setBooleanValue(this.url_component_.is_show_err_no_data = false);
    //this.url_component_.from_3(); 

  }


  private isvmnbtnEnabledSubject = new BehaviorSubject<boolean>(true);
  isvmnbtnEnabled$ = this.isvmnbtnEnabledSubject.asObservable();

  updatevmnbtnState(isEnabled: boolean) {
    this.isvmnbtnEnabledSubject.next(isEnabled);
  }

  constructor(private http: HttpClient, private manageaccservice: ManageAccServiceService,
    private enc: EncdeccryptoService) {
  }
  getRequestTabe(ReqID:any) {
  //  console.log("get request table service");
    const req_body = { "ReqID": ReqID };
  //  console.log(JSON.stringify(req_body));
    return this.http.post(this.baseURL + 'api/Configuration/RequestTable', JSON.stringify(req_body), this.httpOptions);
      //.pipe(
      //  catchError((error: any) => {
      //    console.error('Error occurred during POST request:', error);
      //    // Handle the error here
      //    return throwError(error);
      //  }),
      //  map((response: any) => response?.data) // Check if 'response' is defined before accessing 'data'
      //);
  }
  getInfoTable(ReqID:any) {
  //  console.log("getinfotable in service ");
    const req_body = { "ReqID": ReqID };
  //  console.log(JSON.stringify(req_body));
    return this.http.post(this.baseURL+'api/Configuration/InfoTable',JSON.stringify(req_body),this.httpOptions);
  }

  getNumberTable(ReqID: any) {
  //  console.log("getnumbertable in service ");
    const req_body = { "ReqID": ReqID };
   // console.log(JSON.stringify(req_body));
    return this.http.post(this.baseURL + 'api/Configuration/NumberTable', JSON.stringify(req_body), this.httpOptions);
  }
  UrlConfigure(request_body: any) {
   // console.log("UrlConfigure in service ");
   // console.log("UrlConfigure in service ", request_body);
    return this.http.post(this.baseURL + 'api/Configuration/UrlConfigure', request_body, this.httpOptions);
  }
  getUrlDropdown() {
  //  console.log("getUrlDropdown in service ");
    return this.http.post(this.baseURL + 'api/Configuration/UrlDropDown', this.httpOptions);
  }
  
  getCustomerDropdown() {
   // console.log("getCustomerDropdown in service ");
    return this.http.post(this.baseURL + 'api/Configuration/CustomerDropdown', this.httpOptions);
  }
  
  AddUserCustomerDropdown() {
    //console.log("AddUserCustomerDropdown in service ");
    return this.http.post(this.baseURL + 'api/Configuration/AddUserCustomerDropdown', this.httpOptions);
  }
  AddUser(Req_body:any) {
    //console.log("AddUser in service ");
    return this.http.post(this.baseURL + 'api/Configuration/AddUser', Req_body, this.httpOptions);
  }

  GetUrlTest(req_body: any) {
   // console.log("GetUrlTest in service ");
   // console.log(JSON.stringify(req_body));
    return this.http.post(this.baseURL + 'api/Configuration/UrlTest', req_body, this.httpOptions);
  }

  UrlTestResponse(req_body:any ){
   // console.log("UrlTestResponse in service ");
    //const req_body = {"UrlID": urlID};
    //console.log(JSON.stringify(req_body));
    return this.http.post(this.baseURL + 'api/Configuration/UrlTestResponse', req_body, this.httpOptions);
  }
  APITestResponse(req_body: any) {
   // console.log("APITestResponse in service ");
    //const req_body = {"UrlID": urlID};
    //console.log(JSON.stringify(req_body));
    return this.http.post(this.baseURL + 'api/Configuration/APITestResponse', req_body, this.httpOptions);
  }
  NewRequestDropdown():any {
    return this.http.post(this.baseURL + 'api/Configuration/NewRequestDropdown', this.httpOptions)
  }

  GetNewRequest(req_body: any) {
   // console.log("GetNewRequest in service ");
   
   // console.log(JSON.stringify(req_body));
    return this.http.post(this.baseURL + 'api/Configuration/CreateNewRequest', req_body, this.httpOptions);
  }

  AddVmn(req_body: any) {
   // console.log("AddVmn in service ");

   // console.log(JSON.stringify(req_body));
    return this.http.post(this.baseURL + 'api/Configuration/AddNewVmn', req_body, this.httpOptions);
  }
  getuserdetails(ReqID: any) {
   // console.log("get request table service");
    const req_body = { "ReqID": ReqID };
   // console.log(JSON.stringify(req_body));
    return this.http.post(this.baseURL + 'api/Configuration/ViewAccountDetails', JSON.stringify(req_body), this.httpOptions);
    //.pipe(
    //  catchError((error: any) => {
    //    console.error('Error occurred during POST request:', error);
    //    // Handle the error here
    //    return throwError(error);
    //  }),
    //  map((response: any) => response?.data) // Check if 'response' is defined before accessing 'data'
    //);
  }


}
