import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { UserAdapter } from '../adapter/user-adapter';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private user = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private adapter: UserAdapter
  ) { }

  getLatestUser(): Observable<User> {
    return this.user;
  }

  fetchUserFromApi(id) {
    this.http.get<any>(environment.api + 'user/databyuserid/' + id).subscribe(user => {
      this.user.next(this.adapter.adapt(user));
    });
  }

  getUser(username): any {
    return this.http.get<any>(environment.api + 'user/databyusername/' + username).pipe(
      map(data => this.adapter.adapt(data))
    );
  }

  getUsersBySearchterm(searchTerm: string) {
    return this.http.get<any>(environment.api + 'user/usersbysearchterm/' + searchTerm).pipe(
      map((data: any[]) => data.map((item) => this.adapter.adapt(item)))
    );
  }

  getNumberOfTotalUsers() {
    return this.http.get<any>(environment.api + 'user/numberoftotalusers');
  }

  getLatestPosts() {
    return this.http.get<any>(environment.api + 'post/latest');
  }

  clearData() {
    this.user.next(null);
  }

  uploadImage(file: any) {
    const dataFile = new FormData();
    dataFile.append('image', file);
    const headers = new HttpHeaders({ authorization: 'Client-ID c0df3b4f744766f' });
    return this.http.post('https://api.imgur.com/3/image/', dataFile, { headers });
  }
}
