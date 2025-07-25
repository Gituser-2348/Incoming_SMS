import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AppConfig } from "../../core/AppConfig/app.config";

@Injectable({
    providedIn:'root'
})
export class RegisterService{
    baseURL =AppConfig.Config.api.sms;

    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }),
        responseType: 'json' as const
      };
      constructor(private http: HttpClient) {

    }

    SendMail(MailType:any,MailSub:any,MID:any,MailID:any,otp:any,username:any) {
        // console.log("mailid  "+MailType);
        return this.http.get(this.baseURL + 'api/sign-in/SendMail?MailType='+MailType+'&MailSub='+MailSub+'&MID='+MID+'&MailID='+MailID+'&otp='+otp+'&username='+username, this.httpOptions);
      }
}
