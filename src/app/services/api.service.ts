import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private user = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) { }

  getLatestUser(): Observable<any> {
    return this.user;
  }

  fetchUserFromApi(id) {
    this.http.get<any>(environment.api + 'user/daten/' + id).subscribe(user => {
      this.user.next(user);
    });
  }

  getUser(username) {
    return this.http.get<any>(environment.api + 'user/databyusername/' + username);
  }
}
