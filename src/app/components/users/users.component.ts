import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {

  @Input() header = '';
  @Input() searchTerm = '';

  users: User[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    if (this.searchTerm) {
      this.apiService.getUsersBySearchterm(this.searchTerm).subscribe(res => {
        this.users = res;
      });
    }
    else {
      this.apiService.getUsers().subscribe(res => {
        this.users = res;
      });
    }

  }

  gotoProfile(username: string) {
    this.router.navigate(['users/' + username]);
  }
}


