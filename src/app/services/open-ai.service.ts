import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {
  private apiUrl = 'http://localhost:3000/api/openai';
  // private apiUrl = '/api/openai';

  constructor(private http: HttpClient) { }

  getResponse(content: string): Observable<string | null> {
    return this.http.post<{ response: string }>(`${this.apiUrl}/generate`, { content })
      .pipe(
        map(response => response.response),
        catchError(error => {
          console.error('Error al obtener respuesta de OpenAI:', error);
          return new Observable<null>();
        })
      );
  }
}
