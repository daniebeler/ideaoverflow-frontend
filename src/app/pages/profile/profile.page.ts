import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private auth: AuthService, private api: ApiService, private router: Router) { }

  ngOnInit() {
    this.api.getLatestUser()
    .subscribe((latestUser) => {
      if(latestUser){
        this.loggedIn = true;
        this.user = latestUser;
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
    this.router.navigate(['profile']);
  }

  gotoSettings() {
    this.router.navigate(['settings']);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

}
