import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  user: User;
  loggedIn = false;

  constructor(
    private router: Router,
    private api: ApiService,
    private authService: AuthService  // Is needed to check if logged in
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
    this.router.navigate(['users/' + this.user.username]);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  gotoNewpost() {
    this.router.navigate(['newpost']);
  }

  gotoHome() {
    this.router.navigate(['']);
  }

  search(searchTerm: string){
    if(searchTerm){
      this.router.navigate(['search/' + searchTerm]);
    }
  }
}
