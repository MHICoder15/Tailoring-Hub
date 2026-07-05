import { Observable } from 'rxjs';
import { ApiService } from '../services/api.service';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  UrlTree,
} from '@angular/router';
import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(@Inject(ApiService) private api: ApiService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean {
    if (this.api.isAuthenticated()) {
      return true;
    } else {
      this.router.navigateByUrl('login');
      return false;
    }
  }
}
