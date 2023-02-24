import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { concatMap, map } from 'rxjs/operators';
import { User } from '../models/user';
import { UserAdapter } from '../adapter/user-adapter';
import { Project } from '../models/project';
import { ProjectAdapter } from '../adapter/project-adapter';
import { Idea } from '../models/idea';
import { IdeaAdapter } from '../adapter/idea-adapter';
import { StorageService } from './storage.service';
import { ApiResponseAdapter } from '../adapter/api-response-adapter';
import { ApiResponse } from '../models/api-response';

// eslint-disable-next-line @typescript-eslint/naming-convention
type authStatus = 'Required' | 'Optional';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient,
    private userAdapter: UserAdapter,
    private projectAdapter: ProjectAdapter,
    private ideaAdapter: IdeaAdapter,
    private storageService: StorageService,
    private apiResponseAdapter: ApiResponseAdapter
  ) { }

  getHeader(): HttpHeaders {

    const token = this.storageService.getTokenString();
    if (token) {
      return new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json; charset=utf-8',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: 'Bearer ' + this.storageService.getTokenString()
      });
    }

    return null;
  }


  apiGet(url: string, auth?: authStatus): Observable<ApiResponse> {
    if (auth === 'Required' || auth === 'Optional') {
      const token = this.getHeader();
      if (token) {
        return this.getWithHeader(url, token);
      }

      if (auth === 'Optional') {
        return this.getWithoutHeader(url);
      }

      return new Observable((observer) => {
        observer.next(this.apiResponseAdapter.adapt({ status: 'Error', error: 'Missing JWT' }));
      });
    }

    return this.getWithoutHeader(url);
  }

  apiPost(url: string, body: any, auth?: authStatus): Observable<ApiResponse> {
    if (auth === 'Required' || auth === 'Optional') {
      const token = this.getHeader();
      if (token) {
        return this.postWithHeader(url, body, token);
      }

      if (auth === 'Optional') {
        return this.postWithoutHeader(url, body);
      }

      return new Observable((observer) => {
        observer.next(this.apiResponseAdapter.adapt({ status: 'Error', error: 'Missing JWT' }));
      });
    }

    return this.postWithoutHeader(url, body);
  }

  getWithHeader(url: string, headers: HttpHeaders): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + url, { headers }).pipe(
      map(data => this.apiResponseAdapter.adapt(data))
    );
  }

  getWithoutHeader(url: string): Observable<ApiResponse> {
    return this.httpClient.get<any>(environment.api + url).pipe(
      map(data => this.apiResponseAdapter.adapt(data))
    );
  }

  postWithHeader(url: string, body: any, headers: HttpHeaders): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + url, body, { headers }).pipe(
      map(data => this.apiResponseAdapter.adapt(data))
    );
  }

  postWithoutHeader(url: string, body: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(environment.api + url, body).pipe(
      map(data => this.apiResponseAdapter.adapt(data))
    );
  }




  getUser(username: string): Observable<User> {
    return this.apiGet('user/byusername/' + username).pipe(
      map(data => this.userAdapter.adapt(data.data))
    );
  }

  getUserById(id: number): Observable<User> {
    return this.apiGet('user/byid/' + id).pipe(
      map(data => this.userAdapter.adapt(data.data))
    );
  }

  getUsers(): Observable<User[]> {
    return this.apiGet('user/all/').pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getUsersBySearchterm(searchTerm: string): Observable<User[]> {
    return this.apiGet('user/usersbysearchterm/' + searchTerm).pipe(
      map((data: any) => data.data.map((item) => this.userAdapter.adapt(item)))
    );
  }

  getNumberOfTotalUsers(): Observable<number> {
    return this.apiGet('user/numberoftotalusers').pipe(
      map(data => data.data.numberoftotalusers)
    );
  }

  getNumberOfIdeasByUser(userId: number): Observable<number> {
    return this.apiGet('user/numberofideasbyuser/' + userId).pipe(
      map(data => data.data.numberofideas ?? 0)
    );
  }

  getNumberOfProjectsByUser(userId: number): Observable<number> {
    return this.apiGet('user/numberofprojectsbyuser/' + userId).pipe(
      map(data => data.data.numberofprojects ?? 0)
    );
  }

  register(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/register', data);
  }

  login(email: string, password: string): Observable<ApiResponse> {
    return this.apiPost('registration/login', { email, password });
  }

  verify(code: string): Observable<boolean> {
    return this.httpClient.get<any>(environment.api + 'registration/verify/' + code).pipe(
      map(data => data.verified)
    );
  }

  sendVerificationMailAgain(email: string): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'registration/sendverificationmailagain', { email });
  }

  updateUser(data: any): Observable<ApiResponse> {
    return this.apiPost('user/changedata', data, 'Required');
  }

  changePassword(data: any): Observable<ApiResponse> {
    return this.apiPost('user/changepw', data, 'Required');
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
    return this.apiGet('project/numberoftotalprojects').pipe(
      map(data => data.data?.numberoftotalprojects ?? 0)
    );
  }

  createProject(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'project/create', data, { headers: this.getHeader() });
  }

  updateProject(data: any): Observable<any> {
    return this.httpClient.post<any>(environment.api + 'project/update', data, { headers: this.getHeader() });
  }



  getIdea(id: number): Observable<Idea> {
    return this.apiGet('idea/byid/' + id, 'Optional').pipe(
      map(data => this.ideaAdapter.adapt(data.data))
    );
  }

  getIdeas(parameter: string): Observable<Idea[]> {
    return this.apiGet('idea/all' + parameter).pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.ideaAdapter.adapt(item)))
    );
  }

  getIdeasByUsername(parameter: string): Observable<Idea[]> {
    return this.apiGet('idea/byusername/' + parameter).pipe(
      concatMap(res => {
        if (res.status !== 'OK') {
          return [];
        } else {
          return of(res);
        }
      }), map((res: any) => res.data.map((item) => this.ideaAdapter.adapt(item)))
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
