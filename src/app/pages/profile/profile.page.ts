import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { FollowersPage } from 'src/app/modals/followers/followers.page';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  latestUser: any = null;
  user: any = null;
  loggedIn = false;
  isMyProfile = false;
  isPrivate = true;
  currentProfile = '';
  amFollowingThisProfile = false;

  numberOfFollowers = 0;
  numberOfFollowees = 0;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.currentProfile = this.activatedRoute.snapshot.paramMap.get('username');
    this.api.getUser(this.currentProfile).subscribe(res => {
      this.user = res;
      this.user.profileimage = this.api.getSanitizedUrlFromArrayBuffer(this.user.profileimage);

      console.log(this.user);

      this.isPrivate = this.user.private;
    });

    this.api.getLatestUser()
      .subscribe((latestUser) => {
        this.latestUser = latestUser;
        if (latestUser) {
          this.loggedIn = true;
          if (latestUser.username === this.currentProfile) {
            this.isMyProfile = true;
          }
          else {
            this.auth.checkIfFollowing(this.user.id).subscribe(following => {
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
    this.auth.logout();
  }

  openLink(url) {
    window.open(url, '_blank');
  }

  gotoHome() {
    this.router.navigate(['home']);
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
    this.auth.addFollower(this.user.id);
  }

  unfollow() {
    this.auth.removeFollower(this.user.id);
  }

}
