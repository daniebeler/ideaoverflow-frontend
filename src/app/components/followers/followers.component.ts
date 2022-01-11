import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { FollowerService } from 'src/app/services/follower.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit {

  followers: User[] = [];

  constructor(private followerService: FollowerService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.followerService.getFollowers(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(res => {
      this.followers = res;
      console.log(res);
    });
  }

}
