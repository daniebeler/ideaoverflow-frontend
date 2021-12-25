import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertController, Platform } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { ApiService } from './api.service';

const TOKEN_KEY = 'access_token_1';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationState = new BehaviorSubject<boolean>(null);
  private user = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private alertController: AlertController,
    private storage: Storage,
    private helper: JwtHelperService,
    private platform: Platform,
    private api: ApiService
  ) {
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(token => {
      if (token) {
        const decoded = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.user = decoded;
          this.authenticationState.next(true);
          this.api.fetchUserFromApi(this.getUser().id);
        }
      }
      else {
        this.authenticationState.next(false);
      }
    });
  }

  register(email, username, password1, password2) {

    const obj = {
      email,
      username,
      password1,
      password2
    };

    return this.http.post<any>(environment.api + 'user/register', obj).subscribe(async res => {
      if (res.status === 201) {

        this.router.navigate(['welcome']);
      }
      else {
        const alert = await this.alertController.create({
          cssClass: 'custom-alert-ok',
          backdropDismiss: false,
          header: res.header,
          message: res.message,
          buttons: [{
            text: 'Okay',
            handler: () => {
              if (res.header === 'So weit, so gut.') {
                // this.goToLogin();
              }
            }
          }]
        });

        await alert.present();
      }

    }),
      catchError(e => {
        this.showAlert(e.error.message);
        throw new Error(e);
      });
  }

  login(email, password) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.http.post<any>(environment.api + 'user/login', { email, password }).subscribe(async res => {
      if (res.token) {
        await this.storage.set(TOKEN_KEY, res.token);
        this.user = this.helper.decodeToken(res.token);
        console.log(this.user);
        this.router.navigate(['home']);
      }
      else {
        if (res.notverified === true) {
          const alert = await this.alertController.create({
            cssClass: 'custom-alert-ok',
            backdropDismiss: false,
            header: 'Hoppla!',
            message: res.message,
            buttons: [{
              text: 'Abbrechen'
            }, {
              text: 'Okay',
              role: 'ok',
              handler: () => {
                //neuen Link schicken
                // this.sendVerificationAgain(email);
              }
            }]
          });
          await alert.present();
        }
        else {
          const alert = await this.alertController.create({
            cssClass: 'custom-alert-ok',
            backdropDismiss: false,
            header: 'Hoppla!',
            message: res.message,
            buttons: [{
              text: 'Okay'
            }]
          });
          await alert.present();
        }
      }

    }),
      catchError(e => {
        this.showAlert(e.error.message);
        throw new Error(e);
      });
  }

  showAlert(msg) {
    const alert = this.alertController.create({
      cssClass: 'custom-alert-ok',
      backdropDismiss: false,
      message: msg,
      header: 'Error',
      buttons: ['Okay']
    });
    // eslint-disable-next-line @typescript-eslint/no-shadow
    alert.then(alert => alert.present());
  }

  public getUser(){
    return this.user;
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      // this.api.clearData();
      this.user = null;
      this.authenticationState.next(false);
      this.router.navigate(['/home']);
    });
  }

  updateUser(firstname, lastname, instagram, twitter, github, website) {

    const obj = {
      id: this.getUser().id,
      firstname,
      lastname,
      instagram,
      twitter,
      github,
      website
    };

    return this.http.post<any>(environment.api + 'user/changedata', obj).subscribe(async res => {
      if (res.status === 200) {
        console.log('user aktualisiert');
        this.api.fetchUserFromApi(this.getUser().id);

        const alert = await this.alertController.create({
          cssClass: 'custom-alert-ok',
          backdropDismiss: false,
          header: res.header,
          message: res.message,
          buttons: [{
            text: 'Okay',
            handler: () => {
            }
          }]
        });
        await alert.present();
      }
      else {
        const alert = await this.alertController.create({
          cssClass: 'custom-alert-ok',
          backdropDismiss: false,
          header: res.header,
          message: res.message,
          buttons: [{
            text: 'Fuck',
            handler: () => {
            }
          }]
        });

        await alert.present();
      }

    }),
      catchError(e => {
        this.showAlert(e.error.message);
        throw new Error(e);
      });
  }
}
