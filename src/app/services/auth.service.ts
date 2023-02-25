import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AlertService } from './alert.service';
import { Platform } from '@ionic/angular';
import { StorageService } from './storage.service';
import { UserService } from './user.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  authenticationState = new BehaviorSubject<boolean>(null);
  private decodedUserToken = null;

  private helper: JwtHelperService;

  constructor(
    private router: Router,
    private platform: Platform,
    private apiService: ApiService,
    private alertService: AlertService,
    private storageService: StorageService,
    private userService: UserService
  ) {
    this.helper = new JwtHelperService();
    this.platform.ready().then(() => {
      this.checkToken();
    });
  }

  checkToken() {
    const token = this.storageService.getToken();
    if (token) {
      const decoded = this.helper.decodeToken(token);
      const isExpired = this.helper.isTokenExpired(token);

      if (!isExpired) {
        this.decodedUserToken = decoded;
        this.authenticationState.next(true);
        this.userService.fetchUserFromApi(this.getUser().id);
      }
    }
    else {
      this.authenticationState.next(false);
    }
  }

  register(email, username, password) {

    const obj = {
      email,
      username,
      password
    };

    return this.apiService.register(obj).subscribe(async res => {
      this.alertService.showAlert(
        res.header,
        res.message,
        'Okay', () => {
          if (res.status === 1) {
            this.router.navigate(['login']);
          }
        }
      );
    }),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  login(email, password) {
    return this.apiService.login(email, password).subscribe(async res => {
      if (res.status === 'Error') {
        this.alertService.showAlert('Ooops', res.error);
      } else {
        await this.storageService.setToken(res.data.token);
        this.decodedUserToken = this.helper.decodeToken(res.data.token);
        this.authenticationState.next(true);
        this.userService.fetchUserFromApi(this.getUser().id);
        this.router.navigate(['']);
      }
    });
  }

  sendVerificationMailAgain(email) {
    this.apiService.sendVerificationMailAgain(email).subscribe(async res => {
      this.alertService.showAlert(res.header, res.message);
    });
  }

  public getUser() {
    return this.decodedUserToken;
  }

  logout() {
    this.storageService.removeToken();
    this.userService.clearData();
    this.decodedUserToken = null;
    this.authenticationState.next(false);
    this.router.navigate(['login']);
  }

  updateUser(updatedUser: User) {
    const url: any = updatedUser.profileimage;
    const dataToUpdate = {
      id: this.getUser().id,
      firstname: updatedUser.firstname,
      lastname: updatedUser.lastname,
      country: updatedUser.country,
      state: updatedUser.state,
      profilepicture: url.changingThisBreaksApplicationSecurity,
      bio: updatedUser.bio,
      instagram: updatedUser.instagram,
      twitter: updatedUser.twitter,
      dribbble: updatedUser.dribbble,
      github: updatedUser.github,
      linkedin: updatedUser.linkedin,
      website: updatedUser.website,
      color: updatedUser.color
    };
    return this.apiService.updateUser(dataToUpdate).subscribe(async res => {
      if (res.status === 'OK') {
        this.userService.fetchUserFromApi(this.getUser().id);
      }
      else {
        this.alertService.showAlert('Ooops', res.error);
      }

    });
  }

  changePassword(oldPassword, newPassword) {
    const obj = {
      oldPassword,
      newPassword,
      id: this.getUser().id
    };
    return this.apiService.changePassword(obj).subscribe(async res => {
      if (res.status === 'OK') {
        this.alertService.showAlert('Done', 'Password changed');
      }
      else {
        this.alertService.showAlert('Ooops', res.error);
      }
    });
  }

  resetPassword(email) {
    return this.apiService.resetPassword(email).subscribe(async res => {
      this.alertService.showAlert(res.header, res.message);

    }),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  setPassword(vcode, pw1, pw2) {
    const obj = {
      vcode,
      pw1,
      pw2
    };
    this.apiService.setPassword(obj).subscribe(async res => {
      if (res.stay) {
        this.alertService.showAlert(res.header, res.message);
      }
      else {
        this.alertService.showAlert(
          res.header,
          res.message,
          'Okay',
          this.router.navigate.bind(this.router, ['login'])
        );
      }
    });
  }
}
