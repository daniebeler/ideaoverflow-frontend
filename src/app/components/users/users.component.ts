import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
    private apiService: ApiService
  ) { }

  ngOnInit() {
    if (this.searchTerm) {
      this.subscriptions.push(this.apiService.getUsersBySearchterm(this.searchTerm).subscribe(res => {
        this.users = res;
      }));
    }
    else {
      this.subscriptions.push(this.apiService.getUsers().subscribe(res => {
        this.users = res;
      }));
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
