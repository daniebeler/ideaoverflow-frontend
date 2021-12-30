import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-newpost',
  templateUrl: './newpost.page.html',
  styleUrls: ['./newpost.page.scss'],
})
export class NewpostPage implements OnInit {

  loggedIn = false;
  user: any;

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.api.getLatestUser()
    .subscribe((latestUser) => {
      this.user = latestUser;
      if(latestUser){
        this.loggedIn = true;
      }
      else{
        this.loggedIn = false;
      }
    });
  }

  gotoProfile() {
    this.router.navigate(['profile/' + this.user.username]);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  gotoHome() {
    this.router.navigate(['home']);
  }

}
