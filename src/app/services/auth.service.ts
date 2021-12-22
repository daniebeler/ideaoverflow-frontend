import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient, private alertController: AlertController) { }


  register(schule, email, vorname, nachname, password1, password2) {

    const obj = {
      schule,
      email,
      vorname,
      nachname,
      password1,
      password2
    };

    return this.http.post<any>(environment.api + 'register', obj).subscribe(async res => {
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
