import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserAdapter } from '../adapter/user-adapter';
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
    private alertController: AlertController,
    private adapter: UserAdapter
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
}
