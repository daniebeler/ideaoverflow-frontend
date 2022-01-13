import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {

  @Input() header = '';
  @Input() filterByUsername = '';
  @Input() searchTerm = '';

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = 0;

  sortingCriteria = 'newest';

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

    if (this.filterByUsername) {
      this.queryParams = this.numberOfPosts + '/' + this.skipPosts + '/' + this.filterByUsername;
    }
    else if (this.searchTerm) {
      console.log(this.searchTerm);
      this.queryParams = this.numberOfPosts + '/' + this.skipPosts + '/' + this.searchTerm;
    }
    else {
      this.queryParams = this.numberOfPosts + '/' + this.skipPosts;
    }

    this.postService
      .getSelectedPosts(this.queryParams).subscribe((posts: Post[]) => {
        console.log(posts);
        for (const post of posts) {
          post.body = this.sanitizer.bypassSecurityTrustHtml(post.body);
          this.allLoadedPosts.push(post);
        }
        if (isInitialLoad) { event.target.complete(); }
        this.skipPosts = this.skipPosts + 5;
      });
  }

  loadData(event) {
    this.getPosts(true, event);
  }

}
