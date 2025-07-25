import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { AppConfig } from '../../core/AppConfig/app.config';
import { ManageAccServiceService } from '../../core/manage-acc-service/manage-acc-service.service';
import { EncdeccryptoService } from '../../shared/encdeccrypto.service';
import { FlowbuilderService } from '../flow/flowbuilder.service';

@Injectable({
  providedIn: 'root'
})
export class EndUserService {
  selectedsummaryHeader: any = [{ name: "Message ID", type: "default" }, { name: "Date", type: "default" }, { name: "language", type: 'keyword', answer: ['en', 'mal', 'tam'] }]

 baseURL = AppConfig.Config.api.sms;
 //  baseURL = '/IncomingSMS/';
 // baseURL = AppConfig.Config.url;
  // console.log("JSON Data" + data);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
    responseType: 'json' as const
  };

  //userDataSubject = new BehaviorSubject<NewAgent>({});
  chatLoader = new Subject();
  setChatMessages = new Subject();
  setDrawflowJSON = new Subject();
  currentUser = null;
  clearData = new Subject();
  hideChat = new Subject();
  setUserName = new Subject();
  dynamicChat = new Subject();
  dynamicChatData = new Subject();
  refreshDate = new Subject();
  constructor(private http: HttpClient, private manageaccservice: ManageAccServiceService,
    private enc: EncdeccryptoService, private flowbuilder: FlowbuilderService) {

  }

  GetCustomerDropDown(req_body:any) {
    /*console.log('GetCustomerDropDown service');*/
    /*console.log('req_body', req_body);*/
    return this.http
      .post(this.baseURL + "api/EndUser/EnduserVMNList", req_body,this.httpOptions)
      .pipe(retry(2));
  }
  CustomerSearchVMNList(req_body: any) {
    /*console.log('GetCustomerDropDown service');*/
    return this.http
      .post(this.baseURL + "api/Report/CustomerSearchVMNList", req_body, this.httpOptions)
      .pipe(retry(2));
  }
  VMNReport(req_body: any) {
    /*console.log('VMNReport service');*/
    return this.http
      .post(this.baseURL + "api/EndUser/VMNReport", req_body, this.httpOptions)
      .pipe(retry(2));
  }
  SummaryReport(req_body: any) {
    //console.log('SummaryReport service');
    return this.http
      .post(this.baseURL + "api/EndUser/SummaryReport", req_body, this.httpOptions)
      .pipe(retry(2));
  }
  DetailReport(req_body: any) {
    //console.log('DetailReport service');
    return this.http
      .post(this.baseURL + "api/EndUser/DetailReport", req_body, this.httpOptions)
      .pipe(retry(2));
  }
}
