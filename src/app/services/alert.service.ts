import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private alertController: AlertController) { }

  showAlert(
    header: string,
    message: string,
    submitButtonText: string = 'Okay',
    submitButtonCallback: () => void = Function,
    cancleButtonText?: string
  ) {
    if (cancleButtonText) {
      const alert = this.alertController.create({
        cssClass: 'custom-alert-two',
        backdropDismiss: false,
        message,
        header,
        buttons: [{
          text: cancleButtonText
        }, {
          text: submitButtonText,
          handler: () => submitButtonCallback()
        }],
      });
      alert.then(createdAlert => createdAlert.present());
    } else {
      const alert = this.alertController.create({
        cssClass: 'custom-alert-ok',
        backdropDismiss: false,
        message,
        header,
        buttons: [{
          text: submitButtonText,
          handler: () => submitButtonCallback()
        }],
      });
      alert.then(createdAlert => createdAlert.present());
    }
  }
}
