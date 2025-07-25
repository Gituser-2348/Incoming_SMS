import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  decodedToken: { [key: string]: string };
  jwtHelper = new JwtHelperService();

  constructor() { }


  decodeToken(token: string) {
    return JSON.stringify(this.jwtHelper.decodeToken(token));
  }

  getJsonData(token: string) {
    return JSON.parse(this.decodeToken(token));
  }


  getTokenExpirationDate(token: string) {
    return this.jwtHelper.getTokenExpirationDate(token);
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
}
