import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface NotionPage {
  icon: string;
  title: string;
  socialNetworks: Array<{
    name: string;
    color: string;
  }>;
  url: string;
  state?: string;
  published?: boolean;
  topics?: Array<{
    name: string;
    color: string;
  }>;
  content?: string;
  aiResponse?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotionService {
  private apiUrl = environment.apiUrl + '/api/notion'; // URL de tu backend

  constructor(private http: HttpClient) { }

  queryDatabase(): Observable<any> {
    return this.http.post(`${this.apiUrl}/query-database`, {});
  }

  createPage(pageData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create-page`, pageData);
  }
}
