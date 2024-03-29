import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
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
    private userService: UserService,
    private authService: AuthService  // Is needed to check if logged in
  ) { }

  ngOnInit() {
    const subscription1 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.user = latestUser;
      console.log(latestUser);
      if (latestUser) {
        this.loggedIn = true;
      }
      else {
        this.loggedIn = false;
      }
    });
    this.subscriptions.push(subscription1);
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
