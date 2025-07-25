import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { EncryptDecryptService } from '../services/enc-dec.service';
//import { Observable } from 'rxjs/Observable';
// import { environment } from 'src/environments/environment';

@Injectable()
export class EncryptDecryptAuth implements HttpInterceptor {
    constructor(private encryptDecryptService: EncryptDecryptService, ) {}
    // If you want to some exclude api call from Encryption then add here like that.
    // environment.basUrl is your API URL
    ExcludeURLList = [
      //  environment.baseUrl + "/api/Common/commonFileuploaddata",
       // environment.baseUrl + "/api/Users/UploadProfilePicture",
        //environment.baseUrl + "/api/Common/downloadattachedfile"
    ];
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   // console.log("encrypt decrypt interceptor");
        let exludeFound = this.ExcludeURLList.filter(element => {
            return req.url.includes(element)
        });
        // We have Encrypt the GET and POST call before pass payload to API
    if (!(exludeFound && exludeFound.length > 0)) {
     // console.log("not exclude");
      if (req.method == "GET") {
       // console.log("get",req,req.method);
                if (req.url.indexOf("?") > 0) {
                    let encriptURL = req.url.substr(0, req.url.indexOf("?") + 1) + this.encryptDecryptService.encryptUsingAES256(req.url.substr(req.url.indexOf("?") + 1, req.url.length));
                    const cloneReq = req.clone({
                        url: encriptURL
                    });
                    return next.handle(cloneReq);
                }
                return next.handle(req);
      } else if (req.method == "POST") {
       // console.log("post",req,req.body);
                if (req.body || req.body.length > 0) {
                    const cloneReq = req.clone({
                        body: this.encryptDecryptService.encryptUsingAES256(req.body)
                    });
                //  console.log("clone req ", cloneReq);
                    return next.handle(cloneReq);
                }
                let data = req.body as FormData;
                return next.handle(req);
            }
        }
        return next.handle(req);
    }
}
