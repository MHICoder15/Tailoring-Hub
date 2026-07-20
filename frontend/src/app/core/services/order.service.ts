import { apis } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl: string;

  constructor(public http: HttpClient) {
    this.baseUrl = `${apis.baseUrl}/orders`;
  }

  getOrders(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  getOrderById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  createOrder(params: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, params);
  }

  updateOrder(params: any, id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}`, params);
  }

  updateOrderStatus(status: string, id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/status`, { status });
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
