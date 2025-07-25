import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import {Item} from '../shareddata'

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  rootURL = 'api/';
  constructor(private http: HttpClient) { }

  getAllAccounts(doFilter?: boolean) {
    if (doFilter) return this.http.get("api/circles/1");

    return this.http.get("api/circles/");
  }

  getAllCompanies(circle: string) {
    return this.http.get("api/company/" + circle);
  }

  logLogin() {
    console.log("shared service  :log login");
   return this.http.post<Item[]>(`${this.rootURL}/Common/accounts`,{});
  }

}
