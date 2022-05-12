import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PostAdapter } from '../adapter/post-adapter';
import { Post } from '../models/post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(
    private http: HttpClient,
    private adapter: PostAdapter
  ) { }

  getSelectedPosts(params: any): Observable<Post[]> {
    return this.http.post<Post[]>(environment.api + 'post/posts/', params).pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    );
  }

  getNumberOfTotalPosts(): Observable<number> {
    return this.http.get<any>(environment.api + 'post/numberoftotalposts').pipe(
      map(data => data.numberoftotalposts)
    );
  }

  votePost(voteValue: number, postId: number, userId: number) {
    this.http.post<any>(environment.api + 'post/vote/', { voteValue, postId, userId }).subscribe(() => {
    });
  }

  savePost(postId: number, userId: number) {
    this.http.post<any>(environment.api + 'post/save/', { postId, userId }).subscribe(() => {
    });
  }

  unsavePost(postId: number, userId: number) {
    this.http.post<any>(environment.api + 'post/unsave/', { postId, userId }).subscribe(() => {
    });
  }

  uploadImage(data: FormData) {
    const headers = new HttpHeaders({ authorization: 'Client-ID c0df3b4f744766f' });
    this.http.post('https://api.imgur.com/3/image/', data, { headers }).subscribe((res) => {
    });
  }

  createPost(post: Post): Observable<any> {
    const obj = {
      header: post.title,
      body: post.body.changingThisBreaksApplicationSecurity,
      userID: post.ownerId
    };
    return this.http.post<any>(environment.api + 'post/create/', obj);
  }

  updatePost(post: Post): Observable<any> {
    const obj = {
      title: post.title,
      body: post.body.changingThisBreaksApplicationSecurity,
      postId: post.id
    };
    return this.http.post<any>(environment.api + 'post/update/', obj);
  }
}

