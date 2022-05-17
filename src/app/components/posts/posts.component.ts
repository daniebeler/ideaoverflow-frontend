import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {

  @Input() header = 'Popular Ideas';
  @Input() filterByUsername = '';
  @Input() savedByUsername = false;
  @Input() searchTerm = '';
  @Input() color = 'var(--ion-color-primary)';

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
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getLatestUser()
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

    this.postService.getSelectedPosts(params).subscribe((posts: Post[]) => {
      if (isInitialLoad) {
        event.target.complete();
      }
      for (const post of posts) {
        this.allLoadedPosts.push(post);
      }
    });
  }

  sortingCriteriaChanged(sortingCriteria: string) {
    this.sortingCriteria = sortingCriteria;
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
    this.userService.getLatestUser().subscribe((latestUser) => {
      this.postService.votePost(voteValue, postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).currentUserVoteValue = voteValue;
    });
  }

  savePost(postId: number) {
    this.userService.getLatestUser().subscribe((latestUser) => {
      this.postService.savePost(postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).saved = true;
    });
  }

  unsavePost(postId: number) {
    this.userService.getLatestUser().subscribe((latestUser) => {
      this.postService.unsavePost(postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).saved = false;
    });
  }
}
