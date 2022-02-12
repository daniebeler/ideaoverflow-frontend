import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {

  isVerified = false;
  public devWidth = this.plt.width();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private plt: Platform
  ) { }

   ngOnInit() {
    this.apiService.verify(this.activatedRoute.snapshot.paramMap.get('code')).subscribe(isVerified => {
      this.isVerified = isVerified;
    });
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }
}
