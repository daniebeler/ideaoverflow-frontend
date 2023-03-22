import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Idea } from 'src/app/models/idea';
import { User } from 'src/app/models/user';
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


  postFetchSize = 10;

  queryParams: string;
  allLoadedPosts: Idea[] = [];
  skipPosts = 0;

  showSortingButtons = true;

  currentUser: User = null;

  loading = true;

  sortingCriteria = 'newest';

  alternativeHeader = 'Newest ideas';

  constructor(
    private ideaService: IdeaService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.userService.getLatestUser().subscribe((latestUser) => {
      this.currentUser = latestUser;
      this.getPosts();
    }));
  }

  getPosts(event?: any) {
    this.loading = true;

    let reverse = false;
    let sort = 'date';

    if (this.sortingCriteria === 'likes') {
      sort = 'likes';
    }

    if (this.sortingCriteria === 'oldest') {
      reverse = true;
    }

    const params: any = {
      skip: this.skipPosts,
      take: this.postFetchSize,
      sort,
      reverse
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

    this.skipPosts = this.skipPosts + this.postFetchSize;

    this.subscriptions.push(this.ideaService.getIdeas(params).subscribe((posts: Idea[]) => {
        event?.target.complete();

      for (const post of posts) {
        this.allLoadedPosts.push(post);
      }

      this.loading = false;
    }));
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
    this.skipPosts = 0;
    this.getPosts();
  }

  loadData(event) {
    this.getPosts(event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
