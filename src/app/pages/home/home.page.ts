import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  user: User;

  postsHeader = 'Popular Posts';

  activeContentTab = 'ideas';

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    const subscription1 = this.userService.getLatestUser()
      .subscribe((latestUser) => {
        this.user = latestUser;
      });
    this.subscriptions.push(subscription1);
  }

  gotoProfile() {
    this.router.navigate(['users/' + this.user.username]);
  }

  gotoRegister() {
    this.router.navigate(['register']);
  }

  gotoNewpost() {
    this.router.navigate(['posteditor/new']);
  }

  createIdea() {
    this.router.navigate(['posteditor/new']);
  }

  createProject() {
    this.router.navigate(['projecteditor/new']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
