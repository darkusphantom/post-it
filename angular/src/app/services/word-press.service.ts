import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/index';
import { environment } from 'src/environments/environment';
import { Post } from '../interfaces/post.interface';

@Injectable({
  providedIn: 'root'
})
export class WordPressService {
  private URL_BASE = environment.URL_WORDPRESS

  constructor(
    private http: HttpClient
  ) { }

  getPosts(page: number = 1, perPage: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    return this.http.get<any[]>(`${this.URL_BASE}/posts`, { params });
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.URL_BASE}/posts/${id}`);
  }
}
