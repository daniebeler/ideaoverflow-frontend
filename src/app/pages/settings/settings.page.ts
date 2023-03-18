/* eslint-disable max-len */
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
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  socialsForm: FormGroup;

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
    '#D790DE',
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
    '#1E6ECE',
    '#C061CB',
    '#EC415C',
    '#FFC24D',
    '#FAB5AE',
    '#E4A40A',
    '#8865F7',
    '#BDCEE0',
    '#8F7CD1'
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private userService: UserService,
    private httpClient: HttpClient,
    private domSanitizer: DomSanitizer,
    private toastController: ToastController
  ) {
    this.socialsForm = new FormGroup({
      instagram: new FormControl<string | null>('', Validators.pattern(/^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$/)),
      twitter: new FormControl<string | null>('', Validators.pattern(/^[A-Za-z0-9_]{1,15}$/)),
      dribbble: new FormControl<string | null>(''),
      github: new FormControl<string | null>('', Validators.pattern(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i)),
      linkedin: new FormControl<string | null>(''),
      website: new FormControl<string | null>('', Validators.pattern(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)),
    });
  }

  ngOnInit() {
    this.subscriptions.push(this.httpClient.get('./assets/json/countries.json').subscribe(countries => {
      this.countries = countries;
      this.subscriptions.push(this.userService.getLatestUser().subscribe((latestUser) => {
        this.user = latestUser;
        this.userHash = hash(latestUser);
        if (latestUser) {
          this.country = latestUser.country;
          this.checkForChange();
        }
      }));
    }));

    this.socialsForm.valueChanges.subscribe(x => {
      this.checkForChange();
    });
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
      duration: 3000
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
        this.subscriptions.push(this.apiService.uploadImage(file).subscribe((res: any) => {
          if (res.data.link) {
            this.user.profileimage = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            this.checkForChange();
          }
        }));
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
