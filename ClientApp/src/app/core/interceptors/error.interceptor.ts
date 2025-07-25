

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpHandler } from '@angular/common/http';
import { HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorIntercept implements HttpInterceptor {

    constructor(private toastr: ToastrService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
      //console.log("error interceptor");
        return next.handle(request)
            .pipe(
                // retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    // if (error.error instanceof ErrorEvent) {
                    if (error.error) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                        // this.toastr.error(`Error: ${error.error.message}`, 'Error!');

                    } else {
                        // server-side error
                        errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                        // this.toastr.error(errorMessage, 'Error!');
                    }


                    return throwError(errorMessage);
                })
            )
    }
}
