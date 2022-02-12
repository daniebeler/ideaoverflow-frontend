import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-setnewpassword',
  templateUrl: './setnewpassword.page.html',
  styleUrls: ['./setnewpassword.page.scss'],
})
export class SetnewpasswordPage implements OnInit {

  password1: string;
  password2: string;
  code: string;

  message: string;
  codeIsCorrect: false;

  constructor(
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.code = this.activeRoute.snapshot.paramMap.get('code');
    this.apiService.checkCode(this.code).subscribe(res => {
      this.codeIsCorrect = res.exists;
      this.message = res.message;
    });
  }

  setPassword() {
    this.authService.setPassword(this.code, this.password1, this.password2);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }
}
