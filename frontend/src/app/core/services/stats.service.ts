import { apis } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  baseUrl: string;
  private statsCache$: { [key: string]: Observable<any> } = {};

  constructor(public http: HttpClient) {
    this.baseUrl = `${apis.baseUrl}/stats`;
  }

  getStats(range: string = 'all', forceRefresh: boolean = false): Observable<any> {
    if (!this.statsCache$[range] || forceRefresh) {
      this.statsCache$[range] = this.http
        .get<any>(`${this.baseUrl}?range=${range}`)
        .pipe(shareReplay(1));
    }
    return this.statsCache$[range];
  }

  clearCache(): void {
    this.statsCache$ = {};
  }
}
