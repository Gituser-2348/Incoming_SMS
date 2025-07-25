import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, retry } from 'rxjs/operators';
import { AppConfig } from '../../core/AppConfig/app.config';
import { BehaviorSubject, Subject } from 'rxjs';
import { ReportFilter, DateRange , Headers, detailReport, fetchReportName} from './report.modal';
import { ManageAccServiceService } from '../../core/manage-acc-service/manage-acc-service.service';
// import * as data from '../../app-settings.json';
//import { EncdeccryptoService } from '../../shared/encdeccrypto.service';
import * as CryptoJS from 'crypto-js';
import { EncdeccryptoService } from '../../shared/encdeccrypto.service';
import { FlowbuilderService } from '../flow/flowbuilder.service';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  // selectedDetailHeader:any=[];
  selectedsummaryHeader:any=[{name:"Message ID",type:"default"},{name:"Date",type:"default"},{name:"language",type:'keyword',answer:['en','mal','tam']}]

 baseURL =AppConfig.Config.api.sms;
 //baseURL = '/IncomingSMS/';
//  baseURL = AppConfig.Config.url;
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
  refreshDate=new Subject();
  constructor(private http: HttpClient,private manageaccservice: ManageAccServiceService,
    private enc:EncdeccryptoService,private flowbuilder:FlowbuilderService) {

  }

  getSummaryReport(data:any){
    // console.log(data)
    return  this.http.get(this.baseURL + 'api/report/getSummaryReport?mode='+JSON.stringify(data),
     this.httpOptions)
      .pipe(retry(2));
  }

  getDetailReport(data:detailReport){
    // console.log(data)
    return  this.http.get(this.baseURL + 'api/report/getDetailReport?mode='+JSON.stringify(data),
     this.httpOptions)
      .pipe(retry(2));
    }

    fetchAllAgents(data:any){
      return  this.http.get(this.baseURL + 'api/report/fetchAllAgents?accId='+JSON.stringify(data),
      this.httpOptions)
       .pipe(retry(2));
    }

  fetchReportName(data:fetchReportName){
    return this.http
      .get(this.baseURL + 'api/report/fetchReportName?mode='+JSON.stringify(data), this.httpOptions)
      .pipe(retry(2));
  }

  fetchDetailReport(data){
    return this.http
      .get(this.baseURL + "api/report/DetailReportDetails?mode="+JSON.stringify(data), this.httpOptions)
      .pipe(retry(2));
  }

  fetchLoginReport(data:any){
    return this.http.get(this.baseURL+"api/report/fetchLoginReport?mode="+JSON.stringify(data),this.httpOptions).pipe(retry(2))
  }

  fetchBreak(data:any){
    return this.http.get(this.baseURL+"api/report/fetchBreak?mode="+JSON.stringify(data),this.httpOptions).pipe(retry(2))
  }

  fetchChatReport(data:any){
    return this.http.get(this.baseURL+"api/report/fetchChatReport?mode="+JSON.stringify(data),this.httpOptions).pipe(retry(2))
  }

  fetchPerformance(data:any){
    return this.http.get(this.baseURL+"api/report/fetchPerformance?mode="+JSON.stringify(data),this.httpOptions).pipe(retry(2))
  }

  deleteCustomHeader(data){
    return this.http
      .post(this.baseURL + "api/report/deleteCustomHeader?mode="+JSON.stringify(data), this.httpOptions)
      .pipe(retry(2));
  }

  getAllService(slectedacc){
    return this.http.get(`api/common/service`, {
      params: {
        accid: slectedacc
      }
    })
      .pipe(
        map((result: any) => result === null ? undefined : JSON.parse(result.services)),

      );
  }
  getWhatsappReport(model: ReportFilter) {
    model.accountId=this.manageaccservice.SelectedAccount.Value;
    let encData = this.enc.encrypt(JSON.stringify(model))
    return this.http.get(this.baseURL + 'api/report/getWhatsappReport?mode='+encData,
     this.httpOptions)
      .pipe(retry(2));
  }
  
  getKeywords(){
    return this.http.get(this.baseURL + 'api/report/getKeywords',
     this.httpOptions)
      .pipe(retry(2));
  }

  getRCSReport(model: ReportFilter) {
    model.accountId=this.manageaccservice.SelectedAccount.Value;
    // model.serviceId=this.manageaccservice.SelectedService.Value;
    let encData = this.enc.encrypt(JSON.stringify(model))
    return this.http.get(this.baseURL + 'api/report/getRCSReport?mode='+encData, this.httpOptions)
      .pipe(retry(2));
  }
  samplereport() {

    return this.http.post(this.baseURL + 'api/report/samplereport', this.httpOptions)
      .pipe(retry(2));
  }

 updateKeywords(model: Headers) {
    return this.http.post(this.baseURL + 'api/report/updateKeywords', JSON.stringify(model),this.httpOptions)
      .pipe(retry(2));
  }

  getFlowUserDetails(flowId){
    // console.log(flowId)
    return this.http
    .get(`${this.baseURL}api/report/getFlowUserDetails?id=${JSON.stringify(flowId)}`,
    this.httpOptions)
    .pipe(retry(2));
  }
  getUserChat(userData){
    return this.http
    .get(`${this.baseURL}api/report/getUserChat?data=${JSON.stringify(userData)}`,
    this.httpOptions)
    .pipe(retry(2));
  }

  saveReportName(data){
    return this.http
      .post(this.baseURL + "api/report/saveReportName", data, this.httpOptions)
      .pipe(retry(2));
  }

  saveDefaultHeader(data){
    return this.http
      .post(this.baseURL + "api/report/saveDefaultHeader", data, this.httpOptions)
      .pipe(retry(2));
  }

  saveCustomHeader(data){
    return this.http
      .post(this.baseURL + "api/report/saveCustomHeader", data, this.httpOptions)
      .pipe(retry(2));
  }
  GetCustomerDropDown() {
   // console.log('GetCustomerDropDown service');
    return this.http
      .post(this.baseURL + "api/Report/CustomerDropDown", this.httpOptions)
      .pipe(retry(2));
  }
  CustomerSearchVMNList(req_body:any) {
   // console.log('GetCustomerDropDown service');
    return this.http
      .post(this.baseURL + "api/Report/CustomerSearchVMNList", req_body, this.httpOptions)
      .pipe(retry(2));
  }
  VMNReport(req_body: any) {
   // console.log('VMNReport service');
    return this.http
      .post(this.baseURL + "api/Report/VMNReport", req_body, this.httpOptions)
      .pipe(retry(2));
  }
  SummaryReport(req_body: any) {
  //  console.log('SummaryReport service');
    return this.http
      .post(this.baseURL + "api/Report/SummaryReport", req_body, this.httpOptions)
      .pipe(retry(2));
  }
  DetailReport(req_body: any) {
   // console.log('DetailReport service');
    return this.http
      .post(this.baseURL + "api/Report/DetailReport", req_body, this.httpOptions)
      .pipe(retry(2));
  }
  
}
