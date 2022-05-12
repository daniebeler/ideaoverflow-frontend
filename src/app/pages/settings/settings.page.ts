import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  oldPassword: string;
  newPassword1: string;
  newPassword2: string;

  oldUser: User = null;
  updatedUser: User = null;

  countries: any = null;
  states: any = null;

  country: any = null;

  unsavedDataExists = false;

  constructor(
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
    private userService: UserService,
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.httpClient.get('./assets/json/countries.json').subscribe(countries => {
      this.countries = countries;
      this.userService.getLatestUser().subscribe((latestUser) => {
        this.oldUser = latestUser;
        if (latestUser) {
          this.setLocalUserValues();
        }
      });
    });
  }

  setLocalUserValues() {
    const data = {
      id: this.oldUser.id,
      email: this.oldUser.email,
      username: this.oldUser.username,
      firstname: this.oldUser.firstname,
      lastname: this.oldUser.lastname,
      bio: this.oldUser.bio,
      website: this.oldUser.website,
      github: this.oldUser.github,
      twitter: this.oldUser.twitter,
      instagram: this.oldUser.instagram,
      dribbble: this.oldUser.dribbble,
      linkedin: this.oldUser.linkedin,
      country: this.oldUser.country,
      state: this.oldUser.state,
      profileimage: this.oldUser.profileimage,
      creationdate: this.oldUser.creationDate,
      followers: this.oldUser.numberOfFollowers,
      following: this.oldUser.numberOfFollowees,
      color: this.oldUser.color
    };

    this.updatedUser = new User(data);
    this.checkForChange();
  }

  gotoHome() {
    this.router.navigate(['']);
  }

  gotoProfile() {
    this.router.navigate(['users/' + this.oldUser.username]);
  }

  updateUser() {
    this.auth.updateUser(this.updatedUser);
    this.presentToast();
  }

  updateColor(color: string) {
    this.updatedUser.color = color;
    this.checkForChange();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      icon: 'information-circle',
      color: 'primary',
      duration: 3000
    });
    toast.present();
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
    if (event.target.files != null) {
      const file = event.target.files[0];
      if (file != null) {
        this.api.uploadImage(file).subscribe((res: any) => {
          if (res.data.link) {
            this.updatedUser.profileimage = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            this.checkForChange();
          }
        });
      }
    }
  }

  checkForChange() {
    if (
      this.oldUser.firstname !== this.updatedUser.firstname
      || this.oldUser.lastname !== this.updatedUser.lastname
      || this.oldUser.country !== this.updatedUser.country
      || this.oldUser.state !== this.updatedUser.state
      || this.oldUser.bio !== this.updatedUser.bio
      || this.oldUser.instagram !== this.updatedUser.instagram
      || this.oldUser.twitter !== this.updatedUser.twitter
      || this.oldUser.dribbble !== this.updatedUser.dribbble
      || this.oldUser.github !== this.updatedUser.github
      || this.oldUser.linkedin !== this.updatedUser.linkedin
      || this.oldUser.website !== this.updatedUser.website
      || this.oldUser.profileimage !== this.updatedUser.profileimage
      || this.oldUser.color !== this.updatedUser.color
    ) {
      this.unsavedDataExists = true;
    }
    else {
      this.unsavedDataExists = false;
    }
  }
}
