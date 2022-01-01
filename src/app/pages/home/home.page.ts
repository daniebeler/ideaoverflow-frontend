import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  loggedIn = false;
  user: any;

  posts: any = null;

  constructor(private router: Router, private api: ApiService, private auth: AuthService) {}

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


    this.getLatestPosts();
  }

  getLatestPosts(){
    this.api.getLatestPosts().subscribe(posts => {
      this.posts = posts;
      console.log(this.posts);
    });
  }

  gotoProfile() {
    this.router.navigate(['profile/' + this.user.username]);
  }

  gotoLogin() {
    this.router.navigate(['login']);
  }

  gotoNewpost() {
    this.router.navigate(['newpost']);
  }

}
