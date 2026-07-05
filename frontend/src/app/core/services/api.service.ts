import { Router } from '@angular/router';
import { ConstantsService } from './constants.service';
import { map } from 'rxjs/operators';
import { apis } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  totalItems = new BehaviorSubject<any>(true);
  cartItmes = new BehaviorSubject<number>(0);
  public activeTab = '';
  public homeBannerPrice = '';
  searchKeyword = '';
  showLoading = new Subject<boolean>();
  baseUrl: string;
  searchFilter: any;
  userLoggedInSource = new BehaviorSubject(false);
  scrollBottom: boolean;
  scrollBottomChange = new Subject<boolean>();
  userImage = new Subject<string>();
  userLoggedInObs = this.userLoggedInSource.asObservable();
  cartData: any = null;
  IncrementSalaryModalRef: any;
  user: any = {
    id: 0,
    user_name: '',
    email: '',
    user_type: '',
    api_token: '',
    balance: 0,
    status: '',
  };
  constructor(public http: HttpClient) {
    this.baseUrl = apis.baseUrl + '/auth';
    this.scrollBottom = false;
    this.scrollBottomChange.subscribe((value) => {
      this.scrollBottom = value;
    });
    if (localStorage.getItem('accessToken')) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userLoggedInSource.next(true);
    } else {
      this.userLoggedInSource.next(false);
    }

    // if (localStorage.getItem('cart')) {
    //     this.cartData = JSON.parse(localStorage.getItem('cart'))
    //     console.log('new value 1', this.cartData.documents.length)
    //     this.cartItmes.next(this.cartData.documents.length)
    // }
  }

  toggleScrollBottom(value: boolean): void {
    this.scrollBottomChange.next(value);
  }

  login(params: any): Observable<any> {
    const url = `${this.baseUrl}/login`;

    return this.http.post<any>(url, params).pipe(
      map((resp) => {
        console.log("🚀 ~ login ~ resp:", resp)
        if (resp && resp.success) {
          localStorage.setItem('accessToken', resp.data.accessToken);
          localStorage.setItem('refreshToken', resp.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(resp.data.user));
          this.user = resp.data.user;
          console.log(this.user);
          this.userLoggedInSource.next(true);
        }

        return resp;
      })
    );
  }

  register(params: any): Observable<any> {
    const url = `${this.baseUrl}/register`;

    return this.http.post<any>(url, params).pipe(
      map((resp) => {
        console.log("🚀 ~ register ~ resp:", resp)
        if (resp && resp.success && resp.data.token) {
          localStorage.setItem('token', resp.data.token);
          localStorage.setItem('user', JSON.stringify(resp.data));
          this.user = resp.data;
          this.userLoggedInSource.next(true);
        }

        return resp;
      })
    );
  }

  doUserRedirects(resp: any, router: Router) {
    if (resp.data) {
      router.navigate(['/dashboard']);
    }
  }

  logOut(): boolean {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.user.id = 0;
    this.userLoggedInSource.next(false);

    return true;
  }

  isAuthenticated(): boolean {
    if (localStorage.getItem('accessToken')) {
      return true;
    } else {
      return false;
    }
  }

  jsonToFormData(
    jsonObject: { [key: string]: any },
    parentKey?: any,
    carryFormData?: FormData
  ): FormData {
    const formData = carryFormData || new FormData();
    let index = 0;

    // tslint:disable-next-line: forin
    for (const key in jsonObject) {
      if (jsonObject.hasOwnProperty(key)) {
        if (jsonObject[key] !== null && jsonObject[key] !== undefined) {
          let propName = parentKey || key;
          if (parentKey && this.isObject(jsonObject)) {
            propName = parentKey + '[' + key + ']';
          }
          if (parentKey && this.isArray(jsonObject)) {
            propName = parentKey + '[' + index + ']';
          }
          if (jsonObject[key] instanceof File) {
            formData.append(propName, jsonObject[key]);
          } else if (jsonObject[key] instanceof FileList) {
            for (let j = 0; j < jsonObject[key].length; j++) {
              const file = jsonObject[key].item(j);
              if (file !== null) {
                formData.append(propName + '[' + j + ']', file);
              }
            }
          } else if (
            this.isArray(jsonObject[key]) ||
            this.isObject(jsonObject[key])
          ) {
            this.jsonToFormData(jsonObject[key], propName, formData);
          } else if (typeof jsonObject[key] === 'boolean') {
            formData.append(propName, +jsonObject[key] ? '1' : '0');
          } else {
            formData.append(propName, jsonObject[key]);
          }
        }
      }
      index++;
    }

    return formData;
  }
  isArray(val: any) {
    const toString = {}.toString;

    return toString.call(val) === '[object Array]';
  }

  isObject(val: any) {
    return !this.isArray(val) && typeof val === 'object' && !!val;
  }

  searchableLocations(keyword: string, noLoader?: boolean): Observable<any> {
    const loader = noLoader === true ? '?no-loader=true' : '';
    const url = `${apis.baseUrl}/public/searchable-locations/${keyword}${loader}`;

    return this.http.get<any>(url);
  }

  logOutSession(): Observable<any> {
    const url = `${this.baseUrl}/logout`;

    return this.http.post<any>(url, {});
  }

  checkVerificationCode(data: any): Observable<any> {
    const url = `${this.baseUrl}/verify-email`;

    return this.http.post<any>(url, data);
  }

  resendVerificationCode(data: any): Observable<any> {
    const url = `${this.baseUrl}/resend-code`;

    return this.http.post<any>(url, data);
  }

  // Profile update

  companyImageUrl(Id?: number) {
    Id = Id ? Id : -1;

    return `${apis.baseUrl}/public/company-image/${Id}`;
  }
  userImageUrl(userId?: number) {
    userId = userId ? userId : -1;

    return `${apis.baseUrl}/public/profile-image/${userId}`;
  }
  checkResetCode(data: any): Observable<any> {
    const url = `${this.baseUrl}/verify-code`;

    return this.http.post<any>(url, data);
  }

  resetPass(data: any): Observable<any> {
    const url = `${this.baseUrl}/reset-password`;

    return this.http.post<any>(url, data);
  }

  getPlanholdersList(): Observable<any> {
    const url = `${this.baseUrl}/plan-holders-list`;

    return this.http.get<any>(url);
  }

  getIndexPageCounters(): Observable<any> {
    const url = `${this.baseUrl}/home-page-counters`;

    return this.http.get<any>(url);
  }

  getPageContent(params: any): Observable<any> {
    const url = `${this.baseUrl}/page-content`;

    return this.http.get<any>(url, { params });
  }

  checkPermissions(permissions: [any]): boolean {
    if (this.user.user_type === ConstantsService.USER_ROLES.ADMIN) {
      return true;
    }
    const index = this.user.permissions.findIndex(
      (item: any) => permissions.indexOf(item.name) > -1
    );
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }

  checkPermission(permission: string): boolean {
    if (this.user.user_type === ConstantsService.USER_ROLES.ADMIN) {
      return true;
    }
    const index = this.user.permissions.findIndex(
      (item: any) => item.name === permission
    );
    //console.log('asdsad',index,permission,this.user.permissions[index]);

    if (index > -1) {
      return true;
    } else {
      return false;
    }
  }
}
