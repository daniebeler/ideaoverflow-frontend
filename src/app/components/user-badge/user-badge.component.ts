import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-user-badge',
  templateUrl: './user-badge.component.html',
  styleUrls: ['./user-badge.component.scss'],
})
export class UserBadgeComponent  implements OnInit {

  @Input() user: User;
  @Input() creationDate: Date;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {}

  gotoProfile(username: string) {
    this.router.navigate(['/users/' + username]);
  }
}
