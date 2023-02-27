import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FollowerService } from 'src/app/services/follower.service';
import { ManagerService } from 'src/app/services/manager.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  latestUser: User = null;
  user: User = null;
  isMyProfile = false;
  currentProfile = '';
  amFollowingThisProfile = false;

  numberOfIdeas = 0;
  numberOfProjects = 0;

  postsHeader = '';
  projectsHeader = '';

  selectedTab = 'about';
  activeContentTab = 'ideas';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private userService: UserService,
    private followerService: FollowerService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    public managerService: ManagerService
  ) { }

  ngOnInit() {
    this.currentProfile = this.activatedRoute.snapshot.paramMap.get('username');
    const subscription1 = this.apiService.getUser(this.currentProfile).subscribe(res => {
      this.user = res;

      this.postsHeader = 'Ideas by ' + this.user.firstname + ' ' + this.user.lastname;
      this.projectsHeader = 'Projects by ' + this.user.firstname + ' ' + this.user.lastname;

      const subscription2 = this.apiService.getNumberOfIdeasByUser(this.user.id).subscribe(numberOfIdeas => {
        this.numberOfIdeas = numberOfIdeas;
      });

      const subscription3 = this.apiService.getNumberOfProjectsByUser(this.user.id).subscribe(numberOfProjects => {
        this.numberOfProjects = numberOfProjects;
      });

      const subscription4 = this.userService.getLatestUser().subscribe((latestUser) => {
        this.latestUser = latestUser;
        if (latestUser) {
          if (latestUser.username === this.currentProfile) {
            this.isMyProfile = true;
          }
          else {
            // check if following
            this.isMyProfile = false;
          }
        }
        else {
          this.isMyProfile = false;
          this.amFollowingThisProfile = false;
        }
      });
      this.subscriptions.push(subscription2, subscription3, subscription4);
    });
    this.subscriptions.push(subscription1);
  }

  async logout() {
    this.alertService.showAlert('Are you sure?', '', 'Logout', this.authService.logout.bind(this.authService), 'Cancel');
  }

  follow() {
    this.followerService.addFollower(this.user.id);
  }

  unfollow() {
    this.followerService.removeFollower(this.user.id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
