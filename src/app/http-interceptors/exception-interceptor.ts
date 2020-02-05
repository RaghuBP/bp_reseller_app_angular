import { Router } from '@angular/router';
import { Injectable, Injector } from '@angular/core';
import { HttpRequest, HttpEvent, HttpHandler,
        HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private injector: Injector){ }

  handleError(error: HttpErrorResponse) {
    //let router = this.injector.get(Router);
    let errorMsg = '';
    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead
    if(error.error instanceof ErrorEvent){
      // Client Side Error
      errorMsg = `Error: ${error.error.message}`;
    } else {
      // Server side error
      errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
      //this.router.navigate(['/error']);
    }

    // TODO: better job of transforming error for user consumption
    console.log(`operation failed: ${error.message}`);

    console.log(`${errorMsg}`);

    // Let the app keep running by returning an empty result.
    //return of(result as T);
    return throwError(error);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler):
      Observable<HttpEvent<any>> {


        return next.handle(request)
          .pipe(retry(1),
            catchError(error => {
              //let router = this.injector.get(Router);
              let errorMsg = '';
              // TODO: send the error to remote logging infrastructure
              console.error(error); // log to console instead
              if(error.error instanceof ErrorEvent){
                // Client Side Error
                errorMsg = `Error: ${error.error.message}`;
              } else {
                // Server side error
                errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
                console.log(`error status : ${error.status} ${error.statusText}`);
                switch(error.status){
                  case 400:
                    console.log('Validation error');
                    return throwError(error);
                  case 401:      //login
                    this.router.navigateByUrl("/login");
                    break;
                  case 403:     //forbidden
                    this.router.navigateByUrl("/unauthorized");
                    break;
                  default:
                    this.router.navigate(['/error']);
                }


              }

              // TODO: better job of transforming error for user consumption
              console.log(`operation failed: ${error.message}`);

              console.log(`${errorMsg}`);

              // Let the app keep running by returning an empty result.
              //return of(result as T);
              return throwError(error);
            })
          );
      }
}
