import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpClient
  ) { }

  getSelectedPosts(params) {
    return this.http.get<Post[]>(environment.api + 'post/newest/' + params)
      .pipe(
        tap((posts: Post[]) => {
          if (posts.length === 0) {throw new Error('No posts to retrieve');}
        })
      );
  }
}
