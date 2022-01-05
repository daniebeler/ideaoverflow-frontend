import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { UserAdapter } from '../adapter/user-adapter';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private alertController: AlertController,
    private adapter: UserAdapter
  ) { }

  getLatestUser(): Observable<User> {
    return this.user;
  }

  fetchUserFromApi(id) {
    this.http.get<any>(environment.api + 'user/databyuserid/' + id).subscribe(user => {
      user.profileimage = this.getSanitizedUrlFromArrayBuffer(user.profileimage);
      this.user.next(this.adapter.adapt(user));
      console.log(user);
    });
  }

  getUser(username): any {
    return this.http.get<any>(environment.api + 'user/databyusername/' + username).pipe(
      map(data => this.adapter.adapt(data))
    );
  }

  getSanitizedUrlFromArrayBuffer(data: any) {
    let imageURL = null;
    if (data) {
      const arrayBuffer = new Uint8Array(data.data).buffer;
      const blob = new Blob([arrayBuffer]);
      imageURL = URL.createObjectURL(blob);
    } else {
      imageURL = '../assets/icon/favicon.png';
    }

    return this.sanitizer.bypassSecurityTrustUrl(imageURL);
  }

  createPost(header, body, userID) {
    const obj = {
      header,
      body,
      userID
    };
    return this.http.post<any>(environment.api + 'post/create/', obj).subscribe(async res => {
      if (res.status === 200) {
        console.log('that worked');
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

  getLatestPosts() {
    return this.http.get<any>(environment.api + 'post/latest');
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
