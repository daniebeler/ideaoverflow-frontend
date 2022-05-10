import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-component-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {

  @Input() header = 'Popular Projects';
  @Input() filterByUsername = '';
  @Input() savedByUsername = false;
  @Input() searchTerm = '';
  @Input() color = 'var(--ion-color-primary)';

  queryParams: string;
  allLoadedProjects: Project[] = [];
  numberOfProjects = 5;
  skipProjects = -5;
  loadedUser = false;

  showSortingButtons = true;

  currentUser: User = null;

  sortingCriteria = 'newest';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getLatestUser()
      .subscribe((latestUser) => {
        this.currentUser = latestUser;
        this.allLoadedProjects = [];
        this.skipProjects = -5;
        this.getPosts(false, '');
      });
  }

  getPosts(isInitialLoad: boolean, event) {
    this.skipProjects = this.skipProjects + 5;
    const params: any = {
      skip: this.skipProjects,
      take: this.numberOfProjects,
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

    this.apiService.getSelectedProjects(params).subscribe((posts: Project[]) => {
      if (isInitialLoad) {
        event.target.complete();
      }
      for (const post of posts) {
        this.allLoadedProjects.push(post);
      }
    });
  }

  sortingCriteriaChanged(sortingCriteria: string) {
    this.sortingCriteria = sortingCriteria;
    this.allLoadedProjects = [];
    this.skipProjects = -5;
    this.getPosts(false, '');
  }

  loadData(event) {
    this.getPosts(true, event);
  }

  gotoProfile(username: string) {
    this.router.navigate(['users/' + username]);
  }
}
