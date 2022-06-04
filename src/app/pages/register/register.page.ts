import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  email: string;
  username: string;
  password1: string;
  password2: string;

  constructor(
    private authService: AuthService
    ) { }

  ionViewWillEnter() {
    this.email = '';
    this.username = '';
    this.password1 = '';
    this.password2 = '';
  }

  register() {
    this.authService.register(this.email, this.username, this.password1, this.password2);
  }
}
