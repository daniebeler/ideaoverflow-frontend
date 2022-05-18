import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit, OnDestroy {

  @Input() header = '';
  @Input() filterByUsername = '';
  @Input() savedByUsername = false;
  @Input() searchTerm = '';
  @Input() color = 'var(--ion-color-primary)';

  subscriptions: Subscription[] = [];

  queryParams: string;
  allLoadedPosts: Post[] = [];
  numberOfPosts = 5;
  skipPosts = -5;
  loadedUser = false;

  showSortingButtons = true;

  currentUser: User = null;

  sortingCriteria = 'newest';

  alternativeHeader = 'Newest ideas';

  constructor(
    private postService: PostService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    const subscription1 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.currentUser = latestUser;
      this.allLoadedPosts = [];
      this.skipPosts = -5;
      this.getPosts(false, '');
    });
    this.subscriptions.push(subscription1);
  }

  getPosts(isInitialLoad: boolean, event) {
    this.skipPosts = this.skipPosts + 5;
    const params: any = {
      skip: this.skipPosts,
      take: this.numberOfPosts,
      sortingCriteria: this.sortingCriteria,
      currentUserId: this.currentUser?.id
    };

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

    const subscription2 = this.postService.getSelectedPosts(params).subscribe((posts: Post[]) => {
      if (isInitialLoad) {
        event.target.complete();
      }
      for (const post of posts) {
        this.allLoadedPosts.push(post);
      }
    });
    this.subscriptions.push(subscription2);
  }

  sortingCriteriaChanged(sortingCriteria: string) {
    this.sortingCriteria = sortingCriteria;
    if (!this.header) {
      if (sortingCriteria === 'newest') {
        this.alternativeHeader = 'Newest ideas';
      } else if (sortingCriteria === 'likes') {
        this.alternativeHeader = 'Most liked ideas';
      } else if (sortingCriteria === 'oldest') {
        this.alternativeHeader = 'Oldest ideas';
      }
    }
    this.allLoadedPosts = [];
    this.skipPosts = -5;
    this.getPosts(false, '');
  }

  loadData(event) {
    this.getPosts(true, event);
  }

  gotoProfile(username: string) {
    this.router.navigate(['users/' + username]);
  }

  editPost(post: Post) {
    this.router.navigate(['posteditor/' + post.id]);
  }

  votePost(voteValue: number, postId: number) {
    const subscription3 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.postService.votePost(voteValue, postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).currentUserVoteValue = voteValue;
    });
    this.subscriptions.push(subscription3);
  }

  savePost(postId: number) {
    const subscription4 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.postService.savePost(postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).saved = true;
    });
    this.subscriptions.push(subscription4);
  }

  unsavePost(postId: number) {
    const subscription5 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.postService.unsavePost(postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).saved = false;
    });
    this.subscriptions.push(subscription5);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
