import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { FollowerService } from 'src/app/services/follower.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
})
export class FollowersPage implements OnInit {

  followers: User[] = [];
  followees: User[] = [];

  constructor(
    private followerService: FollowerService
  ) { }

  ngOnInit() {
    this.followerService.getFollowers('daniebeler').subscribe(res => {
      this.followers = res;
      console.log(res);
    });

    this.followerService.getFollowees('daniebeler').subscribe(res => {
      this.followees = res;
      console.log(res);
    });
  }

}
