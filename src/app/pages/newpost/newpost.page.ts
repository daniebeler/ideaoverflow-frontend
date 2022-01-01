import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.page.html',
  styleUrls: ['./newpost.page.scss'],
})
export class NewpostPage implements OnInit {

  user: any;

  header: string;
  body: string;

  constructor(
    private router: Router,
    private api: ApiService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.api.getLatestUser()
      .subscribe((latestUser) => {
        this.user = latestUser;
      });
  }

  gotoProfile() {
    this.router.navigate(['profile/' + this.user.username]);
  }

  gotoHome() {
    this.router.navigate(['']);
  }

  async savePost() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-ok',
      backdropDismiss: false,
      header: 'Are you sure?',
      message: 'MeeeM',
      buttons: [{
        text: 'Back'
      }, {
        text: 'Okay',
        role: 'ok',
        handler: () => {
          console.log('header: ' + this.header);
          console.log('body: ' + this.body);
          this.api.createPost(this.header, this.body, this.user.id);
        }
      }]
    });
    await alert.present();
  }

}
