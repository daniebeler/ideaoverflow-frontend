import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage {

  email: string;

  constructor(
    private authService: AuthService
  ) { }

  sendLink() {
    if (this.email) {
      this.authService.resetPassword(this.email);
    }
  }
}
