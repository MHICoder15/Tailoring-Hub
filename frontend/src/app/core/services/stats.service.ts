import { apis } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  baseUrl: string;

  constructor(public http: HttpClient) {
    this.baseUrl = `${apis.baseUrl}/stats`;
  }

  getStats(range: string = 'all'): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?range=${range}`);
  }
}
