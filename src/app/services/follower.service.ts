import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserAdapter } from '../adapter/user-adapter';
import { AlertService } from './alert.service';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FollowerService {

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient,
    private apiService: ApiService,
    private adapter: UserAdapter,
    private alertService: AlertService
  ) { }

  addFollower(followeeID) {
    const obj = {
      followerID: this.authService.getUser().id,
      followeeID
    };
    return this.httpClient.post<any>(environment.api + 'follower/follow', obj).subscribe(async res => {
      if (res.status === 200) {
        this.apiService.fetchUserFromApi(this.authService.getUser().id);
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

  removeFollower(followeeID) {
    const obj = {
      followerID: this.authService.getUser().id,
      followeeID
    };
    return this.httpClient.post<any>(environment.api + 'follower/unfollow', obj).subscribe(async res => {
      if (res.status === 200) {
        this.apiService.fetchUserFromApi(this.authService.getUser().id);
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

  getFollowees(username) {
    return this.httpClient.get<any>(environment.api + 'follower/followeesbyusername/' + username).pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    );
  }

  getFollowers(username) {
    return this.httpClient.get<any>(environment.api + 'follower/followersbyusername/' + username).pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    );
  }

  checkIfFollowing(followeeID) {
    const obj = {
      followerID: this.authService.getUser().id,
      followeeID
    };
    return this.httpClient.post<any>(environment.api + 'follower/checkfollow', obj);
  }
}
