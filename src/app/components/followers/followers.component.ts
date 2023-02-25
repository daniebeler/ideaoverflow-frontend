import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit, OnDestroy {


  @Input() type = '';
  @Input() textIfNoFollowers = '';
  @Input() userId = 1;

  subscriptions: Subscription[] = [];

  followers: User[] = [];

  header = '';

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    if (this.type === 'followers') {
      this.header = 'Followers';
      const subscription1 = this.apiService.getFollowers(this.userId).subscribe(res => {
        this.followers = res;
      });
      this.subscriptions.push(subscription1);
    }
    else {
      this.header = 'Following';
      const subscription2 = this.apiService.getFollowees(this.userId).subscribe(res => {
        this.followers = res;
      });
      this.subscriptions.push(subscription2);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
