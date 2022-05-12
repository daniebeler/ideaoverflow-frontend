import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { UserAdapter } from '../adapter/user-adapter';
import { Project } from '../models/project';
import { ProjectAdapter } from '../adapter/project-adapter';
import { Post } from '../models/post';
import { PostAdapter } from '../adapter/post-adapter';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private userAdapter: UserAdapter,
    private projectAdapter: ProjectAdapter,
    private postAdapter: PostAdapter
  ) { }

  getUser(username): Observable<User> {
    return this.http.get<any>(environment.api + 'user/databyusername/' + username).pipe(
      map(data => this.userAdapter.adapt(data))
    );
  }

  getUsers(): Observable<User[]> {
    return this.http.get<any>(environment.api + 'user/users/').pipe(
      map((data: any[]) => data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getUsersBySearchterm(searchTerm: string): Observable<User[]> {
    return this.http.get<any>(environment.api + 'user/usersbysearchterm/' + searchTerm).pipe(
      map((data: any[]) => data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getNumberOfTotalUsers(): Observable<number> {
    return this.http.get<any>(environment.api + 'user/numberoftotalusers').pipe(
      map(data => data.numberoftotalusers)
    );
  }

  getNumberOfIdeasByUser(userId: number): Observable<number> {
    return this.http.get<any>(environment.api + 'user/numberofideasbyuser/' + userId).pipe(
      map(data => data.numberofideas)
    );
  }

  getNumberOfProjectsByUser(userId: number): Observable<number> {
    return this.http.get<any>(environment.api + 'user/numberofprojectsbyuser/' + userId).pipe(
      map(data => data.numberofprojects)
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(environment.api + 'registration/register', data);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(environment.api + 'registration/login', { email, password });
  }

  verify(code: string): Observable<boolean> {
    return this.http.get<any>(environment.api + 'registration/verify/' + code).pipe(
      map(data => data.verified)
    );
  }

  sendVerificationMailAgain(email: string): Observable<any> {
    return this.http.post<any>(environment.api + 'registration/sendverificationmailagain', { email });
  }

  updateUser(data: any): Observable<any> {
    return this.http.post<any>(environment.api + 'user/changedata', data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post<any>(environment.api + 'user/changepw', data);
  }

  resetPassword(email): Observable<any> {
    return this.http.post<any>(environment.api + 'registration/resetpassword/', { email });
  }

  setPassword(data: any): Observable<any> {
    return this.http.post<any>(environment.api + 'registration/setpassword', data);
  }

  checkCode(code: string): Observable<any> {
    return this.http.get<any>(environment.api + 'registration/checkresetcode/' + code);
  }

  uploadImage(file: any): Observable<any> {
    const dataFile = new FormData();
    dataFile.append('image', file);
    const headers = new HttpHeaders({ authorization: 'Client-ID c0df3b4f744766f' });
    return this.http.post('https://api.imgur.com/3/image/', dataFile, { headers });
  }

  addFollower(data: any): Observable<any> {
    return this.http.post<any>(environment.api + 'follower/follow', data);
  }

  removeFollower(data: any): Observable<any> {
    return this.http.post<any>(environment.api + 'follower/unfollow', data);
  }

  getFollowees(username: string): Observable<User[]> {
    return this.http.get<any>(environment.api + 'follower/followeesbyusername/' + username).pipe(
      map((data: any[]) => data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getFollowers(username: string): Observable<User[]> {
    return this.http.get<any>(environment.api + 'follower/followersbyusername/' + username).pipe(
      map((data: any[]) => data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<any>(environment.api + 'project/byid/' + id).pipe(
      map(data => this.projectAdapter.adapt(data))
    );
  }

  getSelectedProjects(params: any): Observable<Project[]> {
    return this.http.post<Project[]>(environment.api + 'project/projects/', params).pipe(
      map((data: any[]) => data.map((item) => this.projectAdapter.adapt(item)))
    );
  }

  createProject(data: any): Observable<any> {
    return this.http.post<any>(environment.api + 'project/create', data);
  }

  updateProject(data: any): Observable<any> {
    return this.http.post<any>(environment.api + 'project/update', data);
  }

  getPost(id: number): Observable<Post> {
    return this.http.get<any>(environment.api + 'post/byid/' + id).pipe(
      map(data => this.postAdapter.adapt(data))
    );
  }
}
