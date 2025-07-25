import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import * as moment from "moment";
import { JwtTokenService } from './jwt-token.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role, User } from '../model'
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  _tempuserdata: any;
  rootURL = 'api/';
  tempuser: User;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private cookieService: CookieService,
    public jwtTokenService: JwtTokenService) {

    this.currentUserSubject = new BehaviorSubject<User>(this.jwtTokenService.getJsonData(localStorage.getItem('id_token')));
    this.currentUser = this.currentUserSubject.asObservable();

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  authenticate() {

    const token: string = this.cookieService.get('authToken');
    const tokenData = this.jwtTokenService.getJsonData(token);

    let webapp;
    let user;
    webapp = tokenData.Webapp.filter
      (function (app) {
        return app.AppName === "Cpaas"
      });

    user = {
      userid: tokenData.User.UserId,
      role: Role[webapp[0].RoleName],
    };
    
    if (user)
      if (user.userid && user.role) {
        return this.http.post<any>(`${this.rootURL}login/Auth`, user)
          .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('id_token', user.idToken);
            const expiresAt = moment().add(user.expiresIn, 'second');
            localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
            this._tempuserdata = this.jwtTokenService.getJsonData(user.idToken);

            this.tempuser = {
              userid: tokenData.User.UserId,
              loginid: this._tempuserdata.LoginId,
              username: tokenData.User.Name,
              email: tokenData.User.Email,
              phone: tokenData.User.Phone,
              role: Role[webapp[0].RoleName] ,
              accountId: tokenData.Account.AccountId,
              account: tokenData.Account.AccountName,
              location: this._tempuserdata.Location
            };

            this.currentUserSubject.next(this.tempuser);
            return user;

          }));
      }
  }

  public IsLoggedIn(): boolean {
    const token: string = this.cookieService.get('authToken');
    let webapp;
    //let user;

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

        return true;
      }
    }
  }

  public get IsAdmin(): boolean {
   // console.log("this.currentUserValue.role / Role[100] " + this.currentUserValue.role + " / " + Role['SuperSuperAdmin']);
    return (
      this.currentUserValue.role == Role['SuperSuperAdmin'] ||
      this.currentUserValue.role === Role['AccountManager'] ||
      this.currentUserValue.role === Role['PrutechSupport'] ||
      this.currentUserValue.role === Role['SuperAdmin']

    );
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

}
