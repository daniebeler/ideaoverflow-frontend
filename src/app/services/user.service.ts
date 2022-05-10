import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserAdapter } from '../adapter/user-adapter';
import { User } from '../models/user';
import { tint, shade } from 'tint-shade-color';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user = new BehaviorSubject<User>(null);

  constructor(
    private userAdapter: UserAdapter,
    private httpClient: HttpClient
  ) {
    this.getLatestUser().subscribe(user => {
      if (user) {
        if (user.color) {
          document.documentElement.style.setProperty('--ion-color-primary', user.color);
          document.documentElement.style.setProperty('--ion-color-primary-shade', shade(user.color, 0.15));
          document.documentElement.style.setProperty('--ion-color-primary-tint', tint(user.color, 0.15));
        }
      }
    });
  }

  getLatestUser(): Observable<User> {
    return this.user;
  }

  fetchUserFromApi(id): void {
    this.httpClient.get<any>(environment.api + 'user/databyuserid/' + id).subscribe(user => {
      this.user.next(this.userAdapter.adapt(user));
    });
  }

  clearData(): void {
    this.user.next(null);
  }
}
