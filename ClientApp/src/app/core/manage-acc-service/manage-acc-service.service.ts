import { Injectable } from '@angular/core';
import { AccountInfo, ServiceInfo } from './data';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Role, User } from '../model'
import { AuthService } from '../services/auth.service';
import { SigninService } from '../../views/sign-in/sign-in.service';

export interface RespModel {
  status: number;
  data: AccountInfo[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ManageAccServiceService {
  refresh=new Subject();
  rootURL = 'api/';
  accInfo: Observable<AccountInfo[] | undefined>;

  private _selectedService?: ServiceInfo = undefined;
  private _selectedAccount?: AccountInfo = undefined;

  accountChanged = new Subject<AccountInfo>();
  serviceChanged = new Subject<ServiceInfo>();
  newAcc:any;
  user: User;

  constructor(private http: HttpClient,private siginInService:SigninService) {
  }

  getacconts() {
   // console.log("manage acc service getaccount()",);
    return this.http.get<AccountInfo[]>(`${this.rootURL}common/account`, {
      params: {
        userid: this.siginInService.decryptData(sessionStorage.getItem("UserID")),
        userRole:this.siginInService.decryptData(sessionStorage.getItem("RoleID")),
      }
    })
      .pipe(
        //tap(_ => console.log('fetched AccountInfo')),
        map((result: any) => result === null ? undefined :JSON.parse(result.accounts) ),
      );
  }


  getAllServicesbyAccount(slectedacc: string): Observable<ServiceInfo[]> {

    return this.http.get<ServiceInfo[]>(`${this.rootURL}common/service`, {
      params: {
        accid: slectedacc
      }
    })
      .pipe(
        map((result: any) => result === null ? undefined : JSON.parse(result.services)),

      );
  }

  get SelectedAccount(): AccountInfo | undefined {
    return this._selectedAccount;
  }

  set SelectedAccount(account: AccountInfo | undefined) {
    var oldId = this._selectedAccount ? this._selectedAccount.Value : undefined;
    var newid = account ? account.Value : undefined;

    if (oldId !== newid) {
      this._selectedAccount = account;
      this.accountChanged.next(account);

    }
  }

  get SelectedService(): ServiceInfo | undefined {
    return this._selectedService;
  }

  set SelectedService(service: ServiceInfo | undefined) {
    var oldId = this._selectedService
      ? this._selectedService.Value
      : undefined;
    var newid = service ? service.Value : undefined;

    if (oldId !== newid) {
      this._selectedService = service;
      this.serviceChanged.next(service);
    }
  }


}
