import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  user: User;

  postsHeader = 'Popular Posts';

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.api.getLatestUser()
      .subscribe((latestUser) => {
        this.user = latestUser;
      });
  }

  gotoProfile() {
    this.router.navigate(['users/' + this.user.username]);
  }

  gotoRegister() {
    this.router.navigate(['register']);
  }

  gotoNewpost() {
    this.router.navigate(['newpost']);
  }
}
