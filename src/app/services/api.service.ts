import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private user = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer) { }

  getLatestUser(): Observable<any> {
    return this.user;
  }

  fetchUserFromApi(id) {
    this.http.get<any>(environment.api + 'user/daten/' + id).subscribe(user => {
      user.profileimage = this.getSanitizedUrlFromArrayBuffer(user.profileimage);
      this.user.next(user);
    });
  }

  getUser(username): any {
    return this.http.get<any>(environment.api + 'user/databyusername/' + username);
  }

  getSanitizedUrlFromArrayBuffer(data: any) {
    let imageURL = null;
    if(data){
      const arrayBuffer = new Uint8Array(data.data).buffer;
      const blob = new Blob([arrayBuffer]);
      imageURL = URL.createObjectURL(blob);
    } else{
      imageURL = '../assets/icon/favicon.png';
    }

    return this.sanitizer.bypassSecurityTrustUrl(imageURL);
  }
}
