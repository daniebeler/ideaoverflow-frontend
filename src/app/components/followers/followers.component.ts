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
  @Input() userId = -1;

  subscriptions: Subscription[] = [];

  textIfNoFollowers = '';

  followers: User[] = [];

  gridMode: 'list' | 'grid' = 'list';

  header = '';

  loading = true;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    if (this.type === 'followers') {
      this.header = 'Followers';
      this.textIfNoFollowers = 'No followers';
      const subscription1 = this.apiService.getFollowers(this.userId).subscribe(res => {
        this.followers = res;
        this.loading = false;
      });
      this.subscriptions.push(subscription1);
    }
    else {
      this.header = 'Following';
      this.textIfNoFollowers = 'Following nobody';
      const subscription2 = this.apiService.getFollowees(this.userId).subscribe(res => {
        this.followers = res;
        this.loading = false;
      });
      this.subscriptions.push(subscription2);
    }
  }

  changeGridMode(newMode: 'grid' | 'list') {
    this.gridMode = newMode;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
