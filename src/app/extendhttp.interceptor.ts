import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { LocalStorageService } from './services/local-storage.service';
import { projectConstantsLocal } from './constants/project-constants';
import { LeadsService } from './admin/leads/leads.service';

@Injectable()
export class ExtendhttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private leadsService: LeadsService,
    private localStorageService: LocalStorageService
  ) {}

  // intercept(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   const authToken =
  //     this.localStorageService.getItemFromLocalStorage('accessToken');
  //   if (authToken) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });
  //   }
  //   request = request.clone({
  //     url: request.url.startsWith('http')
  //       ? request.url
  //       : projectConstantsLocal.BASE_URL + request.url,
  //     responseType: 'json',
  //   });
  //   return next.handle(request).pipe(
  //     tap(
  //       () => {},
  //       // (error) => {
  //       //   if (error.status === 401) {
  //       //     this.router.navigate(['/login']);
  //       //   }
  //       // }
  //       (error) => {
  //         console.log(error);
  //         if (error.status === 401 || error.status === 419) {
  //           this.localStorageService.clearAllFromLocalStorage();
  //           this.router.navigate(['user', 'login']);
  //         }
  //       }
  //     )
  //   );
  // }


  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authToken =
      this.localStorageService.getItemFromLocalStorage('accessToken');
    const clientIp = this.localStorageService.getItemFromLocalStorage('clientIp') || '';
    if (authToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }
    request = request.clone({
      url: request.url.startsWith('http')
        ? request.url
        : projectConstantsLocal.BASE_URL + request.url,
      responseType: 'json',
      ...(request.url.startsWith('http')
        ? {}
        : {
            setHeaders: {
              'mysystem-IP': clientIp,
            },
          }),
    });
    return next.handle(request).pipe(
      tap(
        () => {},
        (error) => {
          console.log(error);
          if (error.status === 401 || error.status === 419) {
            this.localStorageService.clearAllFromLocalStorage();
            this.router.navigate(['user', 'login']);
          }
        }
      )
    );
  }
  // intercept(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   const authToken =
  //     this.localStorageService.getItemFromLocalStorage('accessToken');
  //   if (authToken) {
  //     request = request.clone({
  //       setHeaders: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     });
  //   }
  //   return from(this.leadsService.getClientIp()).pipe(
  //     switchMap((clientIp) => {
  //       console.log(clientIp);
  //       request = request.clone({
  //         url: request.url.startsWith('http')
  //           ? request.url
  //           : projectConstantsLocal.BASE_URL + request.url,
  //         responseType: 'json',
  //         // setHeaders: {
  //         //   'mysystem-IP': clientIp,
  //         // },
  //         ...(request.url.startsWith('http')
  //           ? {}
  //           : { setHeaders: { 'mysystem-IP': clientIp } }),
  //       });
  //       return next.handle(request);
  //     }),
  //     tap(
  //       () => {},
  //       (error) => {
  //         console.log(error);
  //         if (error.status === 401 || error.status === 419) {
  //           this.localStorageService.clearAllFromLocalStorage();
  //           this.router.navigate(['user', 'login']);
  //         }
  //       }
  //     )
  //   );
  // }
}
