import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { retry } from 'rxjs/operators';
import { AppConfig } from '../../../core/AppConfig/app.config';
import { EncdeccryptoService } from '../../encdeccrypto.service';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  //baseURL = "http://localhost:4200/";
  baseURL = AppConfig.Config.api.sms;
  // console.log("JSON Data" + data);
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
    responseType: 'json' as const
  };
  fileHandler = new Subject()
  emojiPosition = new Subject()
  getQuickReplyWhenCreate = new Subject()

constructor(private http: HttpClient,private enc:EncdeccryptoService) { }

getUserData(data){
  // console.log("dataUser",data)
  return this.http.get(`${this.baseURL}api/agent/getUserData/?agentData=${JSON.stringify(data)}`,this.httpOptions)
}

getSessionMessages(communication_id){
  return  this.http.get(`${this.baseURL}api/agent/getSessionMessages/?id=${communication_id}`,this.httpOptions)
}

sentReply(data){
  return this.http.post(`${this.baseURL}api/agent/sentReply`,data,this.httpOptions)
}
endSession(data){
  return this.http.post(`${this.baseURL}api/agent/endSession`,data,this.httpOptions)
}
chatOpen(chatId){
  return  this.http.get(`${this.baseURL}api/agent/chatOpen/?id=${chatId}`,this.httpOptions)
}
}
