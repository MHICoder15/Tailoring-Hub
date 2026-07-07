import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiInterceptorsService implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // const apiToken = localStorage.getItem('accessToken');
    const apiToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTY2MjgyNGRkNmFjMjcyYjIyMWZlOSIsImlhdCI6MTc4MzQzNjI5OSwiZXhwIjoxNzgzNTIyNjk5fQ.-ZvxnyL_OETVgI2mDSfWFhckAC6uFEeLGV49RJBplq8";
    console.log("🚀 ~ intercept ~ apiToken:", apiToken)
    if (apiToken) {
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${apiToken}`,
        },
      });

      return next.handle(clonedReq);
    } else {
      return next.handle(req);
    }
  }
}
