import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss'],
})
export class FollowersComponent implements OnInit {

  @Input() type = '';
  @Input() textIfNoFollowers = '';

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
      this.apiService.getFollowers(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(res => {
        this.followers = res;
      });
    }
    else {
      this.header = 'Following';
      this.apiService.getFollowees(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(res => {
        this.followers = res;
      });
    }
  }

  gotoFollower(username: string) {
    this.router.navigate(['users/' + username]);
  }

}
