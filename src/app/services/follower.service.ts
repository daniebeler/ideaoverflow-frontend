import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class FollowerService {

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private alertService: AlertService,
    private userService: UserService
  ) { }

  addFollower(followeeID: number) {
    const obj = {
      followerID: this.authService.getUser().id,
      followeeID
    };
    return this.apiService.addFollower(obj).subscribe(async res => {
      if (res.status === 200) {
        this.userService.fetchUserFromApi(this.authService.getUser().id);
      }
      else {
        this.alertService.showAlert('Error', 'That did not work');
      }

    }),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  removeFollower(followeeID: number) {
    const obj = {
      followerID: this.authService.getUser().id,
      followeeID
    };
    return this.apiService.removeFollower(obj).subscribe(async res => {
      if (res.status === 200) {
        this.userService.fetchUserFromApi(this.authService.getUser().id);
      }
      else {
        this.alertService.showAlert(res.header, res.message);
      }

    }),
      catchError(e => {
        this.alertService.showAlert('Error', e.error.message);
        throw new Error(e);
      });
  }

  checkIfFollowing(followeeID: number): Observable<boolean> {
    const obj = {
      followerID: this.authService.getUser().id,
      followeeID
    };
    return this.apiService.checkIfFollowing(obj);
  }
}
