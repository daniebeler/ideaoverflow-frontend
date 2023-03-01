import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FollowerService } from 'src/app/services/follower.service';
import { UserService } from 'src/app/services/user.service';

import { findFlagUrlByIso2Code } from 'country-flags-svg';
import { countries } from 'country-flags-svg';

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

  postsHeader = '';
  projectsHeader = '';

  selectedTab = 'about';
  activeContentTab = 'ideas';

  flagUrl = '';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private userService: UserService,
    private followerService: FollowerService,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.currentProfile = this.activatedRoute.snapshot.paramMap.get('username');
    const subscription1 = this.apiService.getUser(this.currentProfile).subscribe(res => {
      this.user = res;

      this.postsHeader = 'Ideas by ' + this.user.firstname + ' ' + this.user.lastname;
      this.projectsHeader = 'Projects by ' + this.user.firstname + ' ' + this.user.lastname;

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

      this.flagUrl = findFlagUrlByIso2Code(this.user.country);
      this.subscriptions.push(subscription4);
    });
    this.subscriptions.push(subscription1);

    console.log(findFlagUrlByIso2Code('at'));

    console.log(countries[0]);
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
