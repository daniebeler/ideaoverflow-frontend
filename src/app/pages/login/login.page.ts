import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl<string | null>('', Validators.email),
      password: new FormControl<string | null>('', Validators.required)
    });
   }

   onSubmit() {
     if (this.loginForm.value.email && this.loginForm.value.password) {
       this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
     }
   }
}
