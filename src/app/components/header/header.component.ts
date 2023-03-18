import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  user: User;
  loggedIn = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService  // Is needed to check if logged in
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.userService.getLatestUser().subscribe((latestUser) => {
      this.user = latestUser;
      if (latestUser) {
        this.loggedIn = true;
      }
      else {
        this.loggedIn = false;
      }
    }));
  }

  search(searchTerm: string) {
    if (searchTerm) {
      this.router.navigate(['search/' + searchTerm]);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
