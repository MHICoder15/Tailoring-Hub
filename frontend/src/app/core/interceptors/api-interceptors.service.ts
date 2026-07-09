import { Injectable, Injector } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { ApiService } from '../services/api.service';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptorsService implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private injector: Injector) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const apiToken = localStorage.getItem('accessToken');

    // Do not append auth header for public/refresh/login routes
    if (apiToken && !req.url.includes('/refresh-token') && !req.url.includes('/login') && !req.url.includes('/register')) {
      authReq = this.addTokenHeader(req, apiToken);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !req.url.includes('/login') && !req.url.includes('/register')) {
          return this.handle401Error(authReq, next);
        }
        return throwError(error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const apiService = this.injector.get(ApiService);

      return apiService.refreshToken().pipe(
        switchMap((tokenResp: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(tokenResp.accessToken);
          return next.handle(this.addTokenHeader(request, tokenResp.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          // Refresh token failed, perform logout
          apiService.logOut();
          return throwError(err);
        })
      );
    } else {
      // Queue the other requests until token is refreshed
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1),
        switchMap((jwt) => next.handle(this.addTokenHeader(request, jwt)))
      );
    }
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
