import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppConfig } from '../../core/AppConfig/app.config';
import { ManageAccServiceService } from '../../core/manage-acc-service/manage-acc-service.service';
import { EncdeccryptoService } from '../../shared/encdeccrypto.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

 // baseURL = AppConfig.Config.url;
 baseURL = AppConfig.Config.api.sms;
 // baseURL = '/IncomingSMS/';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }),
    responseType: 'json' as const
  };
  

  constructor(private http: HttpClient, private manageaccservice: ManageAccServiceService,
    private enc: EncdeccryptoService) {
  }
  getDashboardReport() {
  //  console.log("ggetDashboardReport service");
   
    
    return this.http.post(this.baseURL + 'api/Dashboard/DashboardReport', this.httpOptions);
    //.pipe(
    //  catchError((error: any) => {
    //    console.error('Error occurred during POST request:', error);
    //    // Handle the error here
    //    return throwError(error);
    //  }),
    //  map((response: any) => response?.data) // Check if 'response' is defined before accessing 'data'
    //);
  }
}
