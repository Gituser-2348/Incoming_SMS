
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { EncryptDecryptService } from '../services/enc-dec.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
constructor(private _encdec: EncryptDecryptService){}

    intercept(req: HttpRequest<any>,
      next: HttpHandler): Observable<HttpEvent<any>> {
      console.log("auth interceptor");
          if (req.body) {
            var body = {}
            // body = {
            //   body: this._encdec.encryptUsingAES256(JSON.stringify(req.body))
            // }
            body = this._encdec.encryptUsingAES256(JSON.stringify(req.body))
          }
          var urlwith_encparam = null;
          var reqparams = null;
          if (req.params.toString()) {
            reqparams = "";

            var params = req.params.toString().split('&');
            var encStr = "";
            params.forEach(element => {
              // Key
              var keyVal = element.split("=");
              var encVal = null;
              if (keyVal[1] != null && keyVal[1] != "null") { encVal = encodeURIComponent((this._encdec.encryptUsingAES256(keyVal[1]))); }
              encStr += `${keyVal[0]}=${encVal}&`;

            });
            reqparams = encStr.substring(0, encStr.length - 1);

          }
          else if (req.urlWithParams.toString().includes('?')) {
            urlwith_encparam = "";

            var index = req.urlWithParams.indexOf("?") + 1;
            urlwith_encparam = req.urlWithParams.substring(0, index); + '?';
            var urlparams = req.urlWithParams.substring(index);
            var params = urlparams.split('&');
            var encStr = "";
            params.forEach(element => {

              var keyVal = element.split("=");
              var encVal = null;
              if (keyVal[1] != null && keyVal[1] != "null") { encVal = encodeURIComponent((this._encdec.encryptUsingAES256(keyVal[1]))); }
              encStr += `${keyVal[0]}=${encVal}&`;

            });

            urlwith_encparam = urlwith_encparam + encStr + '&';
            urlwith_encparam = urlwith_encparam.substring(0, urlwith_encparam.length - 1);

          }

       // const idToken = localStorage.getItem("id_token");
        if (req.headers.has('skip')) {
          return next.handle(req);
            //voice upload dont set content type
            // if (idToken) {

            //     const cloned = req.clone({
            //         setHeaders: {
            //             'Authorization': `Bearer ${idToken}`,
            //         }
            //     });
            //     return next.handle(cloned);
            // }
            // else {
            //     return next.handle(req);
            // }
        }
        else {
            var contentType
            if (req.headers.has('Content-Type'))
                contentType = req.headers.get('Content-Type');
            else
                contentType = "application/json";
                var cloned = null;

        if (reqparams) {
          cloned = req.clone({
            setHeaders: {
              'Content-Type': contentType,
              'X-Content-Type-Options': 'nosniff'
            }, params: reqparams,
            body: body
          });


        }
        else if (urlwith_encparam) {
          cloned = req.clone({
            setHeaders: {
              'Content-Type': contentType,
              'X-Content-Type-Options': 'nosniff'
            }, url: urlwith_encparam,
            body: body
          });


        }
        else {
          cloned = req.clone({
            setHeaders: {
              'Content-Type': contentType,
              'X-Content-Type-Options': 'nosniff'
            },
            body: body
          });

        }

        return next.handle(cloned);

        }

    }

}
