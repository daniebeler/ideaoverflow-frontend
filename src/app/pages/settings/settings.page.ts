import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

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
  profilePicture: any;

  bio: string;
  instagram: string;
  twitter: string;
  github: string;
  dribbble: string;
  linkedin: string;
  website: string;

  oldPassword: string;
  newPassword1: string;
  newPassword2: string;

  user: User = null;

  countries: any = null;
  states: any = null;

  unsavedDataExists = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
    private httpClient: HttpClient) { }

  ngOnInit() {
    this.httpClient.get('./assets/json/countries.json').subscribe(data => {
      this.countries = data;
      this.api.getLatestUser().subscribe((latestUser) => {
        this.user = latestUser;
        if (latestUser) {
          this.setLocalUserValues();
        }
      });
    });
  }

  setLocalUserValues() {
    this.firstname = this.user.firstname;
    this.lastname = this.user.lastname;
    this.isPrivate = !!this.user.isPrivate;
    this.country = this.findCountry(this.user.country);
    this.state = this.user.state;
    this.bio = this.user.bio;
    this.instagram = this.user.instagram;
    this.twitter = this.user.twitter;
    this.dribbble = this.user.dribbble;
    this.github = this.user.github;
    this.linkedin = this.user.linkedin;
    this.website = this.user.website;
    this.profilePicture = this.user.profileimage;
    this.checkForChange();
  }

  gotoHome() {
    this.router.navigate(['']);
  }

  gotoProfile() {
    this.router.navigate(['profile/' + this.user.username]);
  }

  updateUser() {
    const dataToUpdate = {
      id: this.auth.getUser().id,
      firstname: this.firstname,
      lastname: this.lastname,
      private: this.isPrivate,
      country: this.country.country,
      state: this.state,
      profilepicture: this.profilePicture,
      bio: this.bio,
      instagram: this.instagram,
      twitter: this.twitter,
      dribbble: this.dribbble,
      github: this.github,
      linkedin: this.linkedin,
      website: this.website
    };
    this.auth.updateUser(dataToUpdate);
  }

  changePassword() {
    this.auth.changePassword(this.oldPassword, this.newPassword1, this.newPassword2);
  }

  findCountry(valueToFind) {
    for (const country of this.countries.countries) {
      if (country.country === valueToFind) {
        return country;
      }
    }
    return null;
  }

  onFileChange(event) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(event.target.files[0]);
    fileReader.onload = () => {
      this.profilePicture = fileReader.result;
      this.checkForChange();
    };
  }

  checkForChange() {
    if (
      this.user.firstname !== this.firstname
      || this.user.lastname !== this.lastname
      || !!this.user.isPrivate !== this.isPrivate
      || this.user.country !== this.country.country
      || this.user.state !== this.state
      || this.user.bio !== this.bio
      || this.user.instagram !== this.instagram
      || this.user.twitter !== this.twitter
      || this.user.dribbble !== this.dribbble
      || this.user.github !== this.github
      || this.user.linkedin !== this.linkedin
      || this.user.website !== this.website
      || this.user.profileimage !== this.profilePicture
    ) {
      this.unsavedDataExists = true;
    }
    else {
      this.unsavedDataExists = false;
    }
  }
}
