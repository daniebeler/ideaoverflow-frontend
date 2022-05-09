import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserAdapter } from '../adapter/user-adapter';
import { User } from '../models/user';
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
    private httpClient: HttpClient,
    private apiService: ApiService,
    private adapter: UserAdapter,
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
        this.alertService.showOkayAlertWithoutAction(res.header, res.message);
      }

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
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
        this.alertService.showOkayAlertWithoutAction(res.header, res.message);
      }

    }),
      catchError(e => {
        this.alertService.showOkayAlertWithoutAction('Error', e.error.message);
        throw new Error(e);
      });
  }

  checkIfFollowing(followeeID: number): Observable<boolean> {
    const obj = {
      followerID: this.authService.getUser().id,
      followeeID
    };
    return this.httpClient.post<any>(environment.api + 'follower/checkfollow', obj).pipe(
      map(data => data.following)
    );
  }
}
