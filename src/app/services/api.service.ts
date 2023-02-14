import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { UserAdapter } from '../adapter/user-adapter';
import { Project } from '../models/project';
import { ProjectAdapter } from '../adapter/project-adapter';
import { Idea } from '../models/idea';
import { IdeaAdapter } from '../adapter/idea-adapter';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private userAdapter: UserAdapter,
    private projectAdapter: ProjectAdapter,
    private ideaAdapter: IdeaAdapter,
    private storageService: StorageService
  ) { }

  getHeader(): HttpHeaders {
    const headers = new HttpHeaders({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json; charset=utf-8',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: 'Bearer ' + this.storageService.getTokenString()
    });
    return headers;
  }

  getUser(username: string): Observable<User> {
    return this.httpClient.get<any>(environment.api + 'user/databyusername/' + username).pipe(
      map(data => this.userAdapter.adapt(data))
    );
  }

  getUserById(id: number): Observable<User> {
    return this.httpClient.get<any>(environment.api + 'user/databyuserid/' + id).pipe(
      map(data => this.userAdapter.adapt(data))
    );
  }

  getUsers(): Observable<User[]> {
    return this.httpClient.get<any>(environment.api + 'user/users/').pipe(
      map((data: any[]) => data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getUsersBySearchterm(searchTerm: string): Observable<User[]> {
    return this.httpClient.get<any>(environment.api + 'user/usersbysearchterm/' + searchTerm).pipe(
      map((data: any[]) => data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getNumberOfTotalUsers(): Observable<number> {
    return this.httpClient.get<any>(environment.api + 'user/numberoftotalusers').pipe(
      map(data => data.numberoftotalusers)
    );
  }

  getNumberOfIdeasByUser(userId: number): Observable<number> {
    return this.httpClient.get<any>(environment.api + 'user/numberofideasbyuser/' + userId).pipe(
      map(data => data.numberofideas)
    );
  }

  getNumberOfProjectsByUser(userId: number): Observable<number> {
    return this.httpClient.get<any>(environment.api + 'user/numberofprojectsbyuser/' + userId).pipe(
      map(data => data.numberofprojects)
    );
  }

  register(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/register', data);
  }

  login(email: string, password: string): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/login', { email, password });
  }

  verify(code: string): Observable<boolean> {
    return this.httpClient.get<any>(environment.api + 'registration/verify/' + code).pipe(
      map(data => data.verified)
    );
  }

  sendVerificationMailAgain(email: string): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/sendverificationmailagain', { email });
  }

  updateUser(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'user/changedata', data, { headers: this.getHeader() });
  }

  changePassword(data: any): Observable<any> {
    console.log(data);
    return this.httpClient.post<any>(environment.api + 'user/changepw', data, { headers: this.getHeader() });
  }

  resetPassword(email): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/resetpassword/', { email });
  }

  setPassword(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/setpassword', data);
  }

  checkCode(code: string): Observable<any> {
    return this.httpClient.get<any>(environment.api + 'registration/checkresetcode/' + code);
  }

  uploadImage(file: any): Observable<any> {
    const dataFile = new FormData();
    dataFile.append('image', file);
    const headers = new HttpHeaders({ authorization: 'Client-ID c0df3b4f744766f' });
    return this.httpClient.post('https://api.imgur.com/3/image/', dataFile, { headers });
  }

  addFollower(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'follower/follow', data, { headers: this.getHeader() });
  }

  removeFollower(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'follower/unfollow', data, { headers: this.getHeader() });
  }

  getFollowees(username: string): Observable<User[]> {
    return this.httpClient.get<any>(environment.api + 'follower/followeesbyusername/' + username).pipe(
      map((data: any[]) => data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getFollowers(username: string): Observable<User[]> {
    return this.httpClient.get<any>(environment.api + 'follower/followersbyusername/' + username).pipe(
      map((data: any[]) => data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  checkIfFollowing(data: any): Observable<boolean> {
    return this.httpClient.post<any>(environment.api + 'follower/checkfollow', data).pipe(
      map(result => result.following)
    );
  }

  getProject(id: number): Observable<Project> {
    return this.httpClient.get<any>(environment.api + 'project/byid/' + id).pipe(
      map(data => this.projectAdapter.adapt(data))
    );
  }

  getSelectedProjects(params: any): Observable<Project[]> {
    return this.httpClient.post<Project[]>(environment.api + 'project/projects/', params).pipe(
      map((data: any[]) => data.map((item) => this.projectAdapter.adapt(item)))
    );
  }

  getNumberOfTotalProjects(): Observable<number> {
    return this.httpClient.get<any>(environment.api + 'project/numberoftotalprojects').pipe(
      map(data => data.numberoftotalprojects)
    );
  }

  createProject(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'project/create', data, { headers: this.getHeader() });
  }

  updateProject(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'project/update', data, { headers: this.getHeader() });
  }

  getIdea(id: number): Observable<Idea> {
    return this.httpClient.get<any>(environment.api + 'idea/byid/' + id).pipe(
      map(data => this.ideaAdapter.adapt(data))
    );
  }

  getSelectedIdeas(params: any): Observable<Idea[]> {
    return this.httpClient.post<Idea[]>(environment.api + 'idea/ideas/', params).pipe(
      map((data: any[]) => data.map((item) => this.ideaAdapter.adapt(item)))
    );
  }

  getNumberOfTotalIdeas(): Observable<number> {
    return this.httpClient.get<any>(environment.api + 'idea/numberoftotalideas').pipe(
      map(data => data.numberoftotalideas)
    );
  }

  voteIdea(voteValue: number, ideaId: number): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'idea/vote/', { voteValue, ideaId }, { headers: this.getHeader() });
  }

  saveIdea(ideaId: number): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'idea/save/', { ideaId }, { headers: this.getHeader() });
  }

  unsaveIdea(ideaId: number): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'idea/unsave/', { ideaId }, { headers: this.getHeader() });
  }

  createIdea(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'idea/create/', data, { headers: this.getHeader() });
  }

  updateIdea(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'idea/update/', data, { headers: this.getHeader() });
  }

  checkIfIdeaBelongsToUser(ideaId: number): Observable<boolean> {
    return this.httpClient.get<any>(environment.api + 'idea/checkifideabelongstouser/' + ideaId, { headers: this.getHeader() }).pipe(
      map(data => data.accessgranted)
    );
  }

  checkIfProjectBelongsToUser(projectId: number): Observable<boolean> {
    return this.httpClient.get<any>(
      environment.api + 'project/checkifprojectbelongstouser/' + projectId,
      { headers: this.getHeader() }
    ).pipe(
      map(data => data.accessgranted)
    );
  }
}
