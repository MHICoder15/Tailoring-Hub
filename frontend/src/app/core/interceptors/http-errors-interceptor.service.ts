import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Injector, Injectable } from '@angular/core';
import { HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpErrorsInterceptorService implements HttpInterceptor {
  private api!: ApiService;
  constructor(private injector: Injector, private router: Router) {}

  intercept(req: any, next: any) {
    return next
      .handle(req)
      .pipe(catchError((err) => this.handleHttpError(err)));
  }

  private handleHttpError(err: HttpErrorResponse) {
    this.api = this.injector.get(ApiService);
    if (err.status === 401) {
      this.api.logOut(); // auto logout if 401 response returned from api
      this.router.navigateByUrl('login');
    } else {
      this.router.navigateByUrl('404');
    }

    return throwError(err);
  }
}
