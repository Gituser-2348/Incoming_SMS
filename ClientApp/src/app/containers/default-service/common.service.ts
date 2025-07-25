import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AppConfig } from '../../core/AppConfig/app.config';
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  baseURL =AppConfig.Config.api.sms ;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
    responseType: 'json' as const
  };
  constructor(private http: HttpClient, private authService: AuthService) { }


  // getUserInfo() {
  //   var data = { "userid": sessionStorage.getItem('UserID') };
  //   return this.http.post(this.baseURL + 'api/sms/get-userinfo', data, this.httpOptions)
  //     .pipe(retry(2));
  // }

  
}
