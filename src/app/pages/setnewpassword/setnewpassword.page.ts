import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-setnewpassword',
  templateUrl: './setnewpassword.page.html',
  styleUrls: ['./setnewpassword.page.scss'],
})
export class SetnewpasswordPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  password1: string;
  password2: string;
  code: string;

  message: string;
  codeIsCorrect: false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    const subscription1 = this.apiService.checkCode(this.code).subscribe(res => {
      this.codeIsCorrect = res.exists;
      this.message = res.message;
    });
    this.subscriptions.push(subscription1);
  }

  setPassword() {
    this.authService.setPassword(this.code, this.password1, this.password2);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
