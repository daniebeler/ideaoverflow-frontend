import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.page.html',
  styleUrls: ['./pagenotfound.page.scss'],
})
export class PagenotfoundPage implements OnInit {

  user: any;

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.api.getLatestUser()
      .subscribe((latestUser) => {
        this.user = latestUser;
      });
  }

  gotoProfile() {
    this.router.navigate(['profile/' + this.user.username]);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  gotoHome() {
    this.router.navigate(['']);
  }

}
