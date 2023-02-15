import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  registerForm: FormGroup;

  constructor(
    private authService: AuthService
  ) {
    this.registerForm = new FormGroup({
      email: new FormControl<string | null>('', [Validators.required, Validators.email]),
      username: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl<string | null>('', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[\S]{6,}$/)]),
      password2: new FormControl<string | null>('', Validators.required)
    });
  }

  get email() {
    return this.registerForm.get('email');
  }

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get password2() {
    return this.registerForm.get('password2');
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.email.value, this.username.value, this.password.value);
    }
  }
}
