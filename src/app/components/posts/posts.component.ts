import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  constructor(
    private postService: PostService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getPosts(false, '');
  }

  getPosts(isInitialLoad: boolean, event) {
    if (this.skipPosts === 20) {
      event.target.disabled = true;
    }
    this.queryParams = this.numberOfPosts + '/' + this.skipPosts;

    this.postService
      .getSelectedPosts(this.queryParams).subscribe((posts: Post[]) => {
        for (const post of posts) {
          post.body = this.sanitizer.bypassSecurityTrustHtml(post.body);
          this.allLoadedPosts.push(post);
        }
        console.log(this.allLoadedPosts);
        if (isInitialLoad) { event.target.complete(); }
        this.skipPosts = this.skipPosts + 5;
      });
  }

  loadData(event) {
    this.getPosts(true, event);
  }

}
