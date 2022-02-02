import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  public devWidth = this.plt.width();

  constructor(private plt: Platform, private router: Router, private auth: AuthService) { }

  ngOnInit() {
  }

  login() {
    this.auth.login(this.email, this.password);
  }

  gotoRegister() {
    this.router.navigate(['register']);
  }

  gotoResetPassword() {
    this.router.navigate(['resetpassword']);
  }

}
