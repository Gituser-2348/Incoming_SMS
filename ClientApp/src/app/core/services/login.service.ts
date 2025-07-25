import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { JwtTokenService } from './jwt-token.service';
import { AppConfig } from '../AppConfig/app.config';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

 acpURL = AppConfig.Config.api.sms;
 // acpURL = '/IncomingSMS/';
 // acpURL = AppConfig.Config.url;
  AppName = AppConfig.Config.appName;
  rootURL = 'api/';


  private readonly isLoggedin: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService,
    public jwtTokenService: JwtTokenService) {
  }


  public IsLoggedIn(): boolean {

    const token: string = this.cookieService.get('authToken');
    let webapp;

    const tokenData = this.jwtTokenService.getJsonData(token);

    if (!token ||
      !tokenData.User.Name) {

      window.alert("Access Denied !!! Please Login");
      return false;
    }
    else {
      webapp = tokenData.Webapp.filter
        (function (app) {
          return app.AppName === "UserManagement" && app.RoleId == "100"
        });

      if (webapp.length === 0) {
        window.alert("Access Denied !!! Please Login... ");
        return false;

      } else {
        webapp = tokenData.Webapp.filter
          (function (app) {
            return app.AppName === "Cpaas"
          });

        if(!tokenData.User.UserId) return false;

        return true;

      }
    }
  }
  // logout(loginId, mode) {
  //   return this.http.get(this.acpURL + 'api/Login/logout?mode='+mode+'&loginId='+loginId
  //     , this.httpOptions);
  // }
}


