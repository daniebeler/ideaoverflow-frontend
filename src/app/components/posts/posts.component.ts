import { Component, Input, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
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
  @Input() savedByUsername = false;
  @Input() searchTerm = '';

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = -5;
  loadedUser = false;

  showSortingButtons = true;

  currentUser: User = null;

  sortingCriteria = 'newest';

  constructor(
    private postService: PostService,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.apiService.getLatestUser()
      .subscribe((latestUser) => {
        this.currentUser = latestUser;
        this.allLoadedPosts = [];
        this.skipPosts = -5;
        this.getPosts(false, '');
      });
  }

  getPosts(isInitialLoad: boolean, event) {
    this.skipPosts = this.skipPosts + 5;
    const params: any = {
      skip: this.skipPosts,
      take: this.numberOfPosts,
      currentUserId: this.currentUser?.id
    };

    console.log(params);

    if (this.filterByUsername) {
      params.username = this.filterByUsername;
    }
    else if (this.savedByUsername) {
      this.showSortingButtons = false;
      params.savedByUsername = this.savedByUsername;
    }
    else if (this.searchTerm) {
      params.searchTerm = this.searchTerm;
    }

    this.postService.getSelectedPosts(params).subscribe((posts: Post[]) => {
      for (const post of posts) {
        this.allLoadedPosts.push(post);
      }
      if (isInitialLoad) {
        event.target.complete();
      }
    });
  }

  loadData(event) {
    this.getPosts(true, event);
  }

  gotoProfile(username: string) {
    this.router.navigate(['users/' + username]);
  }

  editPost(post: Post) {
    const navigationExtras: NavigationExtras = {
      state: {
        post
      }
    };
    this.router.navigate(['editpost/'], navigationExtras);
  }

  votePost(voteValue: number, postId: number) {
    this.apiService.getLatestUser().subscribe((latestUser) => {
      this.postService.votePost(voteValue, postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).currentUserVoteValue = voteValue;
    });
  }

  savePost(postId: number) {
    this.apiService.getLatestUser().subscribe((latestUser) => {
      this.postService.savePost(postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).saved = true;
    });
  }

  unsavePost(postId: number) {
    this.apiService.getLatestUser().subscribe((latestUser) => {
      this.postService.unsavePost(postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).saved = false;
    });
  }

}
