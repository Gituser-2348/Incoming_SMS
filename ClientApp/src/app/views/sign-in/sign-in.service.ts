import { Injectable,EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { loginmodel,firstTimeLoginModel, authusermodel, changepassmodel } from './sign-in.model';
import { AppConfig } from '../../core/AppConfig/app.config';
import { BehaviorSubject, Subject } from 'rxjs';
import { EncdeccryptoService } from '../../shared/encdeccrypto.service';
// import * as data from '../../app-settings.json';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root'
})
export class SigninService {
  hostingUrl: string;
 
 baseURL =AppConfig.Config.api.sms;
 // baseURL = '/IncomingSMS/';
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
  currentUser = null;
  constructor(private http: HttpClient,  private enc:EncdeccryptoService) {
    
  }

  encryptData(data){
    // console.log(data,"Data")
    if(data!=null &&
      data!= undefined &&
      data != 'undefined'&&
      data != 'null' &&
      data!= "" ){
        // var enc = data.toString()
        // console.log(enc)
      return(CryptoJS.AES.encrypt(JSON.stringify({data}),'U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=').toString())
      // return(CryptoJS.AES.encrypt(data.toString(),'U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=').toString())
    }else{
      return undefined
    }
  }

  decryptData(encryptedData){
    // console.log(encryptedData,"Enc")
    if(encryptedData!=null
      && encryptedData!= undefined
      && encryptedData!= ""
      && encryptedData != 'undefined'
      && encryptedData != 'null'){
      // console.log(CryptoJS.AES.decrypt(encryptedData,'U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=').toString(CryptoJS.enc.Utf8),"DEC")
      let decrypted = CryptoJS.AES.decrypt(encryptedData,'U2FsdGVkX1/UBATuvgtFgZe+GvYotI9mVthtqWjI+Kw=').toString(CryptoJS.enc.Utf8)
      // console.log(decrypted,'dec')
      return JSON.parse(decrypted).data
      // return decrypted
    }else{
      return undefined
    }
  }

  Logout(mode:any) {
    return this.http.post(this.baseURL + 'api/sign-in/logout',mode, this.httpOptions);
  }
  Login(data: loginmodel) {
   // console.log("login service");
  //  console.log(JSON.stringify(data));
   // console.log(this.baseURL);
    return this.http.post(this.baseURL + 'api/Login/signin',JSON.stringify(data), this.httpOptions);

  }

  getSecQuestionList(userid:any) {
   // console.log(userid,'userId')
    // console.log(this.enc.encrypt(userid),'this.enc.encrypt(userid)')
    return this.http.get(this.baseURL + `api/Login/securityQuestions/${userid}`, this.httpOptions)
      .pipe(retry(2));
  }
  FirstTimeLogin(data:firstTimeLoginModel) {
    return this.http.post(this.baseURL + 'api/Login/firstTimeLogin',JSON.stringify(data), this.httpOptions);
  }
  VerifySecurityQs(data:firstTimeLoginModel) {
    return this.http.post(this.baseURL + 'api/Login/verifySecurityAnswer',JSON.stringify(data), this.httpOptions);
  }
  AuthenticateUser(data:authusermodel) {
    return this.http.post(this.baseURL + 'api/Login/authenticateUser',JSON.stringify(data),this.httpOptions);
  }
  ChangePassword(data:changepassmodel) {
    return this.http.post(this.baseURL + 'api/Login/ChangePassword',JSON.stringify(data), this.httpOptions);
  }
  ResendOTP(data:changepassmodel) {
    return this.http.post(this.baseURL + 'api/Login/resendOTP',JSON.stringify(data),this.httpOptions);
  }
  logout(loginId, mode) {

    return this.http.get(this.baseURL + 'api/Login/logout?mode='+mode+'&loginId='+loginId
      , this.httpOptions);
  }
}
