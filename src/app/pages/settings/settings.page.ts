import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import hash from 'object-hash';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  oldPassword: string;
  newPassword1: string;
  newPassword2: string;

  user: User = null;
  userHash = '12';

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
        this.user = latestUser;
        this.userHash = hash(latestUser);
        if (latestUser) {
          this.checkForChange();
        }
      });
    });
  }

  gotoHome() {
    this.router.navigate(['']);
  }

  gotoProfile() {
    this.router.navigate(['users/' + this.user.username]);
  }

  updateUser() {
    this.auth.updateUser(this.user);
    this.presentToast();
  }

  updateColor(color: string) {
    this.user.color = color;
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
            this.user.profileimage = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            this.checkForChange();
          }
        });
      }
    }
  }

  checkForChange() {
    if (this.userHash !== hash(this.user)) {
      this.unsavedDataExists = true;
    } else {
      this.unsavedDataExists = false;
    }
  }
}
