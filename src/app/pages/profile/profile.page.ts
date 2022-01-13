import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FollowerService } from 'src/app/services/follower.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  latestUser: User = null;
  user: User = null;
  isMyProfile = false;
  isPrivate = true;
  currentProfile = '';
  amFollowingThisProfile = false;

  postsHeader = '';
  postsFilter = '';

  selectedTab = 'about';

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private followerService: FollowerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.currentProfile = this.activatedRoute.snapshot.paramMap.get('username');
    this.apiService.getUser(this.currentProfile).subscribe(res => {
      this.user = res;
      console.log(this.user);

      this.postsHeader = 'Posts by ' + this.user.firstname + ' ' + this.user.lastname;
      this.postsFilter = this.user.username;

      this.isPrivate = this.user.isPrivate;
    });

    this.apiService.getLatestUser()
      .subscribe((latestUser) => {
        this.latestUser = latestUser;
        if (latestUser) {
          if (latestUser.username === this.currentProfile) {
            this.isMyProfile = true;
          }
          else {
            this.followerService.checkIfFollowing(this.user.id).subscribe(following => {
              this.amFollowingThisProfile = following.user[0].following;
              this.isMyProfile = false;
            });
          }
        }
        else {
          this.isMyProfile = false;
          this.amFollowingThisProfile = false;
        }

        console.log('myprofile: ' + this.isMyProfile);
        console.log('private: ' + this.isPrivate);
        console.log('amfollowing: ' + this.amFollowingThisProfile);
      });
  }

  logout() {
    this.authService.logout();
  }

  gotoHome() {
    this.router.navigate(['']);
  }

  gotoProfile() {
    this.router.navigate(['profile/' + this.latestUser.username]);
  }

  gotoSettings() {
    this.router.navigate(['settings']);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  follow() {
    this.followerService.addFollower(this.user.id);
  }

  unfollow() {
    this.followerService.removeFollower(this.user.id);
  }
}
