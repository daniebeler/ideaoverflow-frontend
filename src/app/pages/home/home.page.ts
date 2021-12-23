import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  loggedIn = false;

  constructor(private router: Router, private auth: AuthService) {}

  ionViewWillEnter() {
    if(this.auth.getUser()){
      this.loggedIn = true;
    }
    else{
      this.loggedIn = false;
    }
  }

  gotoProfile() {
    this.router.navigate(['profile']);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

}
