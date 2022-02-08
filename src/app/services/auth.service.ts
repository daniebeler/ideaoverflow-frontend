import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { AlertController, Platform } from '@ionic/angular';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationState = new BehaviorSubject<boolean>(null);
  private decodedUserToken = null;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private helper: JwtHelperService,
    private platform: Platform,
    private apiService: ApiService,
    private alertService: AlertService,
    private alertController: AlertController,
    private storageService: StorageService
  ) {
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    this.storageService.getToken().then(token => {
      if (token) {
        const decoded = this.helper.decodeToken(token);
        const isExpired = this.helper.isTokenExpired(token);

        if (!isExpired) {
          this.decodedUserToken = decoded;
          this.authenticationState.next(true);
          this.apiService.fetchUserFromApi(this.getUser().id);
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

    return this.httpClient.post<any>(environment.api + 'registration/register', obj).subscribe(async res => {
      const alert = this.alertController.create({
        cssClass: 'custom-alert-ok',
        backdropDismiss: false,
        header: res.header,
        message: res.message,
        buttons: [{
          text: 'Okay',
          role: 'ok',
          handler: () => {
            if (res.status === 1) {
              this.router.navigate(['login']);
            }
          }
        }]
      });
      alert.then(createdAlert => createdAlert.present());
    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  login(email, password) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.httpClient.post<any>(environment.api + 'registration/login', { email, password }).subscribe(async res => {
      if (res.token) {
        await this.storageService.setToken(res.token);
        this.decodedUserToken = this.helper.decodeToken(res.token);
        this.authenticationState.next(true);
        this.apiService.fetchUserFromApi(this.getUser().id);
        this.router.navigate(['']);
      }
      else if (res.notverified === true) {
        const alert = await this.alertController.create({
          cssClass: 'custom-alert-ok',
          backdropDismiss: false,
          header: 'Ooops!',
          message: 'Your email is not verified yet. Do you want to receive another verification code?',
          buttons: [{
            text: 'Cancel'
          }, {
            text: 'Send again',
            role: 'ok',
            handler: () => {
              this.sendVerificationMailAgain(email);
            }
          }]
        });
        await alert.present();
      }
      else {
        this.alertService.showOkayAlertWithoutAction('Ooops', res.message);
      }

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  verify(code) {
    return this.httpClient.get<any>(environment.api + 'registration/verify/' + code);
  }

  sendVerificationMailAgain(email) {
    this.httpClient.post<any>(environment.api + 'registration/sendverificationmailagain', { email }).subscribe(async res => {
      this.alertService.showOkayAlertWithoutAction(res.header, res.message);
    });
  }

  public getUser() {
    return this.decodedUserToken;
  }

  logout() {
    this.storageService.removeToken().then(() => {
      this.apiService.clearData();
      this.decodedUserToken = null;
      this.authenticationState.next(false);
      this.router.navigate(['login']);
    });
  }

  updateUser(dataToUpdate) {
    return this.httpClient.post<any>(environment.api + 'user/changedata', dataToUpdate).subscribe(async res => {
      if (res.status === 200) {
        this.apiService.fetchUserFromApi(this.getUser().id);
      }
      else {
        this.alertService.showOkayAlertWithoutAction(res.header, res.message);
      }

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  changePassword(oldPassword, newPassword1, newPassword2) {
    const obj = {
      oldPassword,
      newPassword1,
      newPassword2,
      id: this.getUser().id
    };
    return this.httpClient.post<any>(environment.api + 'user/changepw', obj).subscribe(async res => {
      this.alertService.showOkayAlertWithoutAction(res.header, res.message);

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  resetPassword(email) {
    return this.httpClient.post<any>(environment.api + 'registration/resetpassword/', { email }).subscribe(async res => {
      this.alertService.showOkayAlertWithoutAction(res.header, res.message);

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  checkCode(code) {
    return this.httpClient.get<any>(environment.api + 'registration/checkresetcode/' + code);
  }

  setPassword(vcode, pw1, pw2) {
    const obj = {
      vcode,
      pw1,
      pw2
    };
    this.httpClient.post<any>(environment.api + 'registration/setpassword', obj).subscribe(async res => {
      if (res.stay) {
        this.alertService.showOkayAlertWithoutAction(res.header, res.message);
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
              this.router.navigate(['login']);
            }
          }]
        });
        await alert.present();
      }
    });
  }
}
