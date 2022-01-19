import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
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

  getSelectedPosts(params: any) {

    return this.http.post<Post[]>(environment.api + 'post/posts/', params)
      .pipe(
        map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
      );
  }

  getNumberOfTotalPosts() {
    return this.http.get<any>(environment.api + 'post/numberoftotalposts');
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

  updatePost(title, body, postId) {
    const obj = {
      title,
      body,
      postId
    };
    return this.http.post<any>(environment.api + 'post/update/', obj).subscribe(async res => {
      if (res.status === 200) {
      }
      else {
        // this.alertService.showOkayAlertWithoutAction(res.header, res.message);
      }

    }),
      catchError(e => {
        // this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }
}

