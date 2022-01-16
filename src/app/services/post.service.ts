import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
    this.http.post<any>(environment.api + 'post/vote/', { voteValue, postId, userId }).subscribe((res) => {
      console.log('meem');
    });
  }
}
