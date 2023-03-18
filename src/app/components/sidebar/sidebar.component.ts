import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  user: User;
  loggedIn = false;

  constructor(
    public router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.userService.getLatestUser().subscribe((latestUser) => {
      this.user = latestUser;
      this.loggedIn = latestUser !== null;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
