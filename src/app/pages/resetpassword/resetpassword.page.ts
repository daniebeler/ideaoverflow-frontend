import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage {

  email: string;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  sendLink(){
    if(this.email){
      this.authService.resetPassword(this.email);
    }
  }
}
