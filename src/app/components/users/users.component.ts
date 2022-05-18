import { HttpClient } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {

  @Input() header = '';
  @Input() searchTerm = '';

  subscriptions: Subscription[] = [];

  users: User[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.searchTerm) {
      const subscription1 = this.apiService.getUsersBySearchterm(this.searchTerm).subscribe(res => {
        this.users = res;
      });
      this.subscriptions.push(subscription1);
    }
    else {
      const subscription2 = this.apiService.getUsers().subscribe(res => {
        this.users = res;
      });
      this.subscriptions.push(subscription2);
    }
  }

  gotoProfile(username: string) {
    this.router.navigate(['users/' + username]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
