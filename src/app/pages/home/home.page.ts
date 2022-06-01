import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
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

  activeContentTab = 'ideas';

  constructor(
    private userService: UserService
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
}
