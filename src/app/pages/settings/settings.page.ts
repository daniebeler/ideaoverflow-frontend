import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  isPrivate: boolean;
  country: any;
  state: string;

  instagram: string;
  twitter: string;
  github: string;
  website: string;

  oldPassword: string;
  newPassword1: string;
  newPassword2: string;

  user: any = null;
  countries: any = null;
  states: any = null;

  constructor(private router: Router, private auth: AuthService, private api: ApiService, private httpClient: HttpClient) {
    this.httpClient.get('./assets/json/countries.json').subscribe(data => {
      this.countries = data;
      console.log(this.countries);
    });
   }

  ngOnInit() {
    this.api.getLatestUser()
    .subscribe((latestUser) => {
      if(latestUser){
        this.user = latestUser;
        this.setLocalUserValues();
      }
    });
  }

  setLocalUserValues() {
    console.log(this.user);
    this.firstname = this.user.firstname;
    this.lastname = this.user.lastname;
    this.isPrivate = this.user.private;
    this.country = this.user.country;
    this.state = this.user.state;
    this.instagram = this.user.instagram;
    this.twitter = this.user.twitter;
    this.github = this.user.github;
    this.website = this.user.website;

    console.log(this.isPrivate);
    console.log(this.user.private);
    console.log(this.country);
  }

  gotoHome() {
    console.log(this.isPrivate);
    console.log(this.user.private);
    this.router.navigate(['home']);
  }

  gotoProfile() {
    this.router.navigate(['profile/' + this.user.username]);
  }

  updateUser() {
    console.log(this.country);
    console.log(this.state);
    this.auth.updateUser(this.firstname, this.lastname, this.isPrivate, this.country.country, this.state, this.instagram, this.twitter, this.github, this.website);
  }

  changePassword() {
    this.auth.changePassword(this.oldPassword, this.newPassword1, this.newPassword2);
   }

}
