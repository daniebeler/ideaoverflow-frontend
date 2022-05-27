import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  isVerified = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) { }

   ngOnInit() {
    const subscription1 = this.apiService.verify(this.activatedRoute.snapshot.paramMap.get('code')).subscribe(isVerified => {
      this.isVerified = isVerified;
    });
    this.subscriptions.push(subscription1);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
