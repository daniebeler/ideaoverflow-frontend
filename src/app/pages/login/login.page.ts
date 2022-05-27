import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  email: string;
  password: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  login() {
    this.authService.login(this.email, this.password);
  }

  gotoRegister() {
    this.router.navigate(['register']);
  }

  gotoResetPassword() {
    this.router.navigate(['resetpassword']);
  }
}
