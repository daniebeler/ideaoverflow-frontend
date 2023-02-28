import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-component-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit, OnDestroy {

  @Input() header = '';
  @Input() filterByUsername = '';
  @Input() savedByUsername = false;
  @Input() searchTerm = '';
  @Input() color = 'var(--ion-color-primary)';

  subscriptions: Subscription[] = [];

  queryParams: string;
  allLoadedProjects: Project[] = [];
  numberOfProjects = 5;
  skipProjects = -5;
  loadedUser = false;

  loading = true;

  showSortingButtons = true;

  currentUser: User = null;

  sortingCriteria = 'newest';

  alternativeHeader = 'Newest projects';

  constructor(
    private projectService: ProjectService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const subscription1 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.currentUser = latestUser;
      this.allLoadedProjects = [];
      this.skipProjects = -5;
      this.getPosts(false, '');
    });
    this.subscriptions.push(subscription1);
  }

  getPosts(isInitialLoad: boolean, event) {
    this.loading = true;
    this.skipProjects = this.skipProjects + 5;

    let reverse = false;
    const sort = 'date';

    if (this.sortingCriteria === 'oldest') {
      reverse = true;
    }

    const params: any = {
      skip: this.skipProjects,
      take: this.numberOfProjects,
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

    this.subscriptions.push(this.projectService.getProjects(params).subscribe((posts: Project[]) => {
      if (isInitialLoad) {
        event.target.complete();
      }
      for (const post of posts) {
        this.allLoadedProjects.push(post);
      }

      this.loading = false;
    }));
  }

  sortingCriteriaChanged(sortingCriteria: string) {
    this.sortingCriteria = sortingCriteria;
    if (!this.header) {
      if (sortingCriteria === 'newest') {
        this.alternativeHeader = 'Newest projects';
      } else if (sortingCriteria === 'oldest') {
        this.alternativeHeader = 'Oldest projects';
      }
    }
    this.allLoadedProjects = [];
    this.skipProjects = -5;
    this.getPosts(false, '');
  }

  loadData(event) {
    this.getPosts(true, event);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
