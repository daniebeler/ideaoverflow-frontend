import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  firstname: string;
  lastname: string;

  instagram: string;
  twitter: string;
  github: string;
  website: string;

  oldPassword: string;
  newPassword1: string;
  newPassword2: string;

  user: any = null;

  constructor(private router: Router, private auth: AuthService, private api: ApiService) { }

  ngOnInit() {
    this.api.getLatestUser()
    .subscribe((latestUser) => {
      if(latestUser){
        this.user = latestUser;
        this.setLocalUser();
      }
    });
  }

  setLocalUser() {
    console.log(this.user);
    this.firstname = this.user.firstname;
    this.lastname = this.user.lastname;
    this.instagram = this.user.instagram;
    this.twitter = this.user.twitter;
    this.github = this.user.github;
    this.website = this.user.website;
  }

  gotoHome() {
    this.router.navigate(['home']);
  }

  gotoProfile() {
    this.router.navigate(['profile']);
  }

  updateUser() {
    this.auth.updateUser(this.firstname, this.lastname, this.instagram, this.twitter, this.github, this.website);
  }

  changePassword() {
    this.auth.changePassword(this.oldPassword, this.newPassword1, this.newPassword2);
   }

}
