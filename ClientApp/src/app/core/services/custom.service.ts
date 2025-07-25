import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomService {
  private config: any;
  constructor(private http: HttpClient) { }
  loadConfig(): Promise<void> {
    return this.http
      .get('/src/config/config.prod.json')
      .toPromise()
      .then((config) => {
        this.config = config;
      });
  }

  getHostingURL(): string {
    return this.config?.hosting_url || '';
  }
}
