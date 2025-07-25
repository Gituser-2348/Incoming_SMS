import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, retry } from 'rxjs/operators';
import { AppConfig } from '../../core/AppConfig/app.config';

@Injectable({
    providedIn: 'root'
})
export class broadcastingService {
    baseURL = AppConfig.Config.api.sms;
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }),
        responseType: 'json' as const
      };
    constructor(private http: HttpClient){}

    fetchTempName(service){
        return this.http.get(this.baseURL+"api/broadcast/fetchTempName?serviceId="+service,this.httpOptions).pipe(retry(2))
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

      tempBaseUpload(data:any){
        return this.http.post(this.baseURL + 'api/broadcast/tempBaseUpload', data, this.httpOptions);
      }
}