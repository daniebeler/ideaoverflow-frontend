import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FollowersPage } from 'src/app/modals/followers/followers.page';
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
  loggedIn = false;
  isMyProfile = false;
  isPrivate = true;
  currentProfile = '';
  amFollowingThisProfile = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private followerService: FollowerService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.currentProfile = this.activatedRoute.snapshot.paramMap.get('username');
    this.apiService.getUser(this.currentProfile).subscribe(res => {
      this.user = res;
      this.user.profileimage = this.apiService.getSanitizedUrlFromArrayBuffer(this.user.profileimage);

      console.log(this.user);

      this.isPrivate = this.user.isPrivate;
    });

    this.apiService.getLatestUser()
      .subscribe((latestUser) => {
        this.latestUser = latestUser;
        if (latestUser) {
          this.loggedIn = true;
          if (latestUser.username === this.currentProfile) {
            this.isMyProfile = true;
          }
          else {
            this.followerService.checkIfFollowing(this.user.id).subscribe(following => {
              this.amFollowingThisProfile = following.user[0].following;
            });
          }
        }
        else {
          this.loggedIn = false;
        }
      });
  }

  async openFollowersModal() {
    const modal = await this.modalController.create({
      component: FollowersPage,
      cssClass: 'bezahlen-modal',
      swipeToClose: true,
      presentingElement: await this.modalController.getTop()
    });

    return await modal.present();
  }

  logout() {
    this.authService.logout();
  }

  openLink(url) {
    window.open(url, '_blank');
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
