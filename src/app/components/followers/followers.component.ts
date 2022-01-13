import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { FollowerService } from 'src/app/services/follower.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit {

  @Input() type = '';

  followers: User[] = [];

  header = '';

  constructor(
    private followerService: FollowerService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.type === 'followers') {
      this.header = 'Followers';
      this.followerService.getFollowers(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(res => {
        this.followers = res;
      });
    }
    else {
      this.header = 'Following';
      this.followerService.getFollowees(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(res => {
        this.followers = res;
      });
    }
  }

  gotoFollower(username: string) {
    this.router.navigate(['profile/' + username]);
  }

}
