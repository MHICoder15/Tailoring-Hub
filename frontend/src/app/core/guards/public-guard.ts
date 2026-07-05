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
export class PublicGuard implements CanActivate {
  constructor(@Inject(ApiService) private api: ApiService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | boolean {
    if (this.api.isAuthenticated()) {
      this.router.navigateByUrl('dashboard');
      return false;
    } else {
      return true;
    }
  }
}
