import { Injectable } from '@angular/core';
import {
  HttpResponse,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoaderService } from '../../shared/service/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(private loaderService: LoaderService) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    this.loaderService.isLoading.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   // console.log("loader interceptor",req);
    this.requests.push(req);
    this.loaderService.isLoading.next(true);
    return Observable.create(observer => {
      const subscription = next.handle(req)
        .subscribe(
          event => {
           // console.log("event :subsribe loader interceptor", event);
            if (event instanceof HttpResponse) {
             // console.log("if instance of event https response");
              this.removeRequest(req);
              observer.next(event);
            }
          },
          err => {
          //  console.log("error" , err);
             //alert('error' + err);
            this.removeRequest(req);
            observer.error(err);
          },
          () => {
          //  console.log("req",req);
            this.removeRequest(req);
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
       // console.log("return", req);
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
