import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user: any = null;
  loggedIn = false;
  isMyProfile = false;
  isPrivate = true;
  currentProfile = '';

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.currentProfile = this.activatedRoute.snapshot.paramMap.get('username');
    this.api.getUser(this.currentProfile).subscribe(res => {
      this.user = res;
      this.isPrivate = this.user.private;
    });

    this.api.getLatestUser()
    .subscribe((latestUser) => {
      if(latestUser){
        this.loggedIn = true;
        if(latestUser.username === this.currentProfile){
          this.isMyProfile = true;
        }
      }
      else{
        this.loggedIn = false;
      }
    });
  }

  logout() {
    this.auth.logout();
  }

  openLink(url){
    window.open(url, '_blank');
  }

  gotoHome() {
    this.router.navigate(['home']);
  }

  gotoProfile() {
    this.router.navigate(['profile/' + this.user.username]);
  }

  gotoSettings() {
    this.router.navigate(['settings']);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

}
