import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { Platform } from '@ionic/angular';

const TOKEN_KEY = 'access_token_1';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationState = new BehaviorSubject<boolean>(null);
  private decodedUserToken = null;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private storage: Storage,
    private helper: JwtHelperService,
    private platform: Platform,
    private apiService: ApiService,
    private alertService: AlertService
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

    return this.httpClient.post<any>(environment.api + 'user/register', obj).subscribe(async res => {
      if (res.status === 201) {

        this.router.navigate(['welcome']);
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

  login(email, password) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.httpClient.post<any>(environment.api + 'user/login', { email, password }).subscribe(async res => {
      if (res.token) {
        await this.storage.set(TOKEN_KEY, res.token);
        this.decodedUserToken = this.helper.decodeToken(res.token);
        this.apiService.fetchUserFromApi(this.getUser().id);
        this.router.navigate(['']);
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
    return this.httpClient.get<any>(environment.api + 'user/verify/' + code);
  }

  public getUser() {
    return this.decodedUserToken;
  }

  logout() {
    this.storage.remove(TOKEN_KEY).then(() => {
      // this.api.clearData();
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



}
