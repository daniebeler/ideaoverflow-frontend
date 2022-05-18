import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  subscriptions: Subscription[] = [];

  followers: User[] = [];

  header = '';

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.type === 'followers') {
      this.header = 'Followers';
      const subscription1 = this.apiService.getFollowers(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(res => {
        this.followers = res;
      });
      this.subscriptions.push(subscription1);
    }
    else {
      this.header = 'Following';
      const subscription2 = this.apiService.getFollowees(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(res => {
        this.followers = res;
      });
      this.subscriptions.push(subscription2);
    }
  }

  gotoFollower(username: string) {
    this.router.navigate(['users/' + username]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
