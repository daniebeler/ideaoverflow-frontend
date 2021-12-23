import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  firstname: string;
  lastname: string;

  oldpassword: string;
  newpassword1: string;
  newpassword2: string;

  user: any = null;

  constructor(private router: Router, private auth: AuthService, private api: ApiService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if (this.auth.getUser) {
      this.api.getUserData(this.auth.getUser().id).subscribe(userData => {
        this.user = userData;
        this.firstname = userData.firstname;
        this.lastname = userData.lastname;
      });
    }
  }

  gotoHome() {
    this.router.navigate(['home']);
  }

  save() {
  }

  changePassword(){}

}
