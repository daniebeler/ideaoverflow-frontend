import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private userData: any = null;

  constructor(private http: HttpClient) { }


  getUserData(id) {
    if (this.userData === null) {
      this.userData = this.http.get<any>(environment.api + 'user/daten/' + id);
    }
    return this.userData;
  }
}
