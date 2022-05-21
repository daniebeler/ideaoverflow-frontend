import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Idea } from 'src/app/models/idea';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { IdeaService } from 'src/app/services/idea.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './ideas.component.html',
  styleUrls: ['./ideas.component.scss'],
})
export class IdeasComponent implements OnInit, OnDestroy {

  @Input() header = '';
  @Input() filterByUsername = '';
  @Input() savedByUsername = false;
  @Input() searchTerm = '';
  @Input() color = 'var(--ion-color-primary)';

  subscriptions: Subscription[] = [];

  queryParams: string;
  allLoadedPosts: Idea[] = [];
  numberOfPosts = 5;
  skipPosts = -5;
  loadedUser = false;

  showSortingButtons = true;

  currentUser: User = null;

  sortingCriteria = 'newest';

  alternativeHeader = 'Newest ideas';

  constructor(
    private ideaService: IdeaService,
    private apiService: ApiService,
    private router: Router,
    private userService: UserService,
    private toastController: ToastController
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

    const subscription2 = this.apiService.getSelectedIdeas(params).subscribe((posts: Idea[]) => {
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

  editPost(post: Idea) {
    this.router.navigate(['posteditor/' + post.id]);
  }

  votePost(voteValue: number, postId: number) {
    if (this.currentUser) {
      const subscription3 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.ideaService.voteIdea(voteValue, postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).currentUserVoteValue = voteValue;
    });
    this.subscriptions.push(subscription3);
    } else {
      this.presentToast('You have to be logged in to vote ideas');
    }
  }

  savePost(postId: number) {
    if (this.currentUser) {
      const subscription4 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.ideaService.saveIdea(postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).saved = true;
    });
    this.subscriptions.push(subscription4);
    } else {
      this.presentToast('You have to be logged in to save Ideas');
    }
  }

  unsavePost(postId: number) {
    if (this.currentUser) {
      const subscription5 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.ideaService.unsaveIdea(postId, latestUser.id);
      this.allLoadedPosts.find(x => x.id === postId).saved = false;
    });
    this.subscriptions.push(subscription5);
    } else {
      this.presentToast('You have to be logged in to save Ideas');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      icon: 'information-circle',
      color: 'primary',
      duration: 2500
    });
    toast.present();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
