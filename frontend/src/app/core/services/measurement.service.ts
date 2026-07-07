import { apis } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeasurementService {
  baseUrl: any;

  constructor(public http: HttpClient) {
    this.baseUrl = `${apis.baseUrl}/measurements`;
  }

  getMeasurements(): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.get<any>(url);
  }

  createMeasurement(params: any): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.post<any>(url, params);
  }

  updateMeasurement(params: any, id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.patch<any>(url, params);
  }

  deleteMeasurement(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<any>(url);
  }
}