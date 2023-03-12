import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import hash from 'object-hash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  oldPassword: string;
  newPassword1: string;
  newPassword2: string;

  user: User = null;
  userHash = '12';

  countries: any = null;

  country = '';

  unsavedDataExists = false;

  colors: string[] = [
    '#0cc87e',
    '#1bab49',
    '#fb4e4e',
    '#02d9c5',
    '#8851cf',
    '#57acdc',
    '#344448',
    '#d28a23',
    '#ff7c2e',
    '#f59aba',
    '#F3DE4B',
    '#3785E4',
    '#E0CCBC',
    '#32CE79',
    '#44ABBF',
    '#A6CBF7',
    '#E8E7E6',
    '',
    '',
    '',
    ''
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private userService: UserService,
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    const subscription1 = this.httpClient.get('./assets/json/countries.json').subscribe(countries => {
      this.countries = countries;
      const subscription2 = this.userService.getLatestUser().subscribe((latestUser) => {
        this.user = latestUser;
        this.userHash = hash(latestUser);
        if (latestUser) {
          this.country = latestUser.country;
          this.checkForChange();
        }
      });
      this.subscriptions.push(subscription2);
    });
    this.subscriptions.push(subscription1);
  }

  gotoHome() {
    this.router.navigate(['']);
  }

  gotoProfile() {
    this.router.navigate(['users/' + this.user.username]);
  }

  updateUser() {
    this.authService.updateUser(this.user);
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
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  changePassword() {
    this.authService.changePassword(this.oldPassword, this.newPassword1);
  }

  onFileChange(event) {
    if (event.target.files != null) {
      const file = event.target.files[0];
      if (file != null) {
        const subscription3 = this.apiService.uploadImage(file).subscribe((res: any) => {
          if (res.data.link) {
            this.user.profileimage = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            this.checkForChange();
          }
        });
        this.subscriptions.push(subscription3);
      }
    }
  }

  checkForChange() {
    this.user.country = this.country;
    if (this.userHash !== hash(this.user)) {
      this.unsavedDataExists = true;
    } else {
      this.unsavedDataExists = false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
