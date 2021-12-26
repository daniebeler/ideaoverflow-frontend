import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {

  verified = false;
  public devWidth = this.plt.width();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private plt: Platform
  ) { }

   ngOnInit() {
    this.auth.verify(this.activatedRoute.snapshot.paramMap.get('code')).subscribe(res => {
      this.verified = res.verified;
    });
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }
}
