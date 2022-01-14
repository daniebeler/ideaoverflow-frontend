import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
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

  currentUser: User = null;

  sortingCriteria = 'newest';

  constructor(
    private postService: PostService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getPosts(false, '');
  }

  getPosts(isInitialLoad: boolean, event) {

    this.apiService.getLatestUser().subscribe((latestUser) => {
      const params: any = {
        skip: this.skipPosts,
        take: this.numberOfPosts,
        currenUserId: latestUser?.id
      };

      if (this.filterByUsername) {
        params.username = this.filterByUsername;
      }
      else if (this.searchTerm) {
        console.log(this.searchTerm);
        params.searchTerm = this.searchTerm;
      }

      console.log(params);

      this.postService.getSelectedPosts(params).subscribe((posts: Post[]) => {
        console.log(posts);
        for (const post of posts) {
          post.body = this.sanitizer.bypassSecurityTrustHtml(post.body);
          this.allLoadedPosts.push(post);
        }
        if (isInitialLoad) { event.target.complete(); }
        this.skipPosts = this.skipPosts + 5;
      });
    });


  }

  loadData(event) {
    this.getPosts(true, event);
  }

  gotoProfile(username: string) {
    this.router.navigate(['profile/' + username]);
  }

}
