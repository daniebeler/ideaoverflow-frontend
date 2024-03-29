import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { ManagerService } from 'src/app/services/manager.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  user: User;

  postsHeader = 'Popular Posts';

  constructor(
    private userService: UserService,
    public router: Router,
    public managerService: ManagerService
  ) { }

  ngOnInit() {
    const subscription1 = this.userService.getLatestUser()
      .subscribe((latestUser) => {
        this.user = latestUser;
      });
    this.subscriptions.push(subscription1);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  goto(route: string) {
    this.router.navigate([route]);
  }
}
