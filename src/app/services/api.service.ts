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


  // -----------------------------------
  // User
  // -----------------------------------


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

  updateUser(data: any): Observable<ApiResponse> {
    return this.apiPost('user/changedata', data, 'Required');
  }


  // -----------------------------------
  // Auth
  // -----------------------------------


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


  // -----------------------------------
  // Follower
  // -----------------------------------


  addFollower(data: any): Observable<ApiResponse> {
    return this.apiPost('follower/follow', data, 'Required');
  }

  removeFollower(data: any): Observable<ApiResponse> {
    return this.apiPost('follower/unfollow', data, 'Required');
  }

  getFollowees(userId: number): Observable<User[]> {
    return this.apiGet('follower/followeesbyuserid/' + userId, 'Optional').pipe(
      map((data: any) => data.data.map((item) => this.userAdapter.adapt(item.user)))
    );
  }

  getFollowers(userId: number): Observable<User[]> {
    return this.apiGet('follower/followersbyuserid/' + userId, 'Optional').pipe(
      map((data: any) => data.data.map((item) => this.userAdapter.adapt(item.user)))
    );
  }


  // -----------------------------------
  // Projects
  // -----------------------------------

  getProject(id: number): Observable<Project> {
    return this.apiGet('project/byid/' + id).pipe(
      map(data => this.projectAdapter.adapt(data.data))
    );
  }

  getSelectedProjects(params: any): Observable<Project[]> {
    return this.apiGet('project/all/', params).pipe(
      map((data: any) => data.data.map((item) => this.projectAdapter.adapt(item)))
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

  checkIfProjectBelongsToUser(projectId: number): Observable<boolean> {
    return this.httpClient.get<any>(
      environment.api + 'project/checkifprojectbelongstouser/' + projectId,
      { headers: this.getHeader() }
    ).pipe(
      map(data => data.accessgranted)
    );
  }


  // -----------------------------------
  // Ideas
  // -----------------------------------

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

  getIdeasSavedByUser(parameter: string): Observable<Idea[]> {
    return this.apiGet('idea/saved/' + parameter, 'Required').pipe(
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
    return this.apiGet('idea/numberoftotalideas').pipe(
      map(data => data.data.numberoftotalideas)
    );
  }

  voteIdea(voteValue: number, ideaId: number): Observable<ApiResponse> {
    return this.apiPost('idea/vote/', { voteValue, ideaId }, 'Required');
  }

  saveIdea(ideaId: number): Observable<ApiResponse> {
    return this.apiPost('idea/save/', { ideaId }, 'Required');
  }

  unsaveIdea(ideaId: number): Observable<ApiResponse> {
    return this.apiPost('idea/unsave/', { ideaId }, 'Required');
  }

  createIdea(data: any): Observable<ApiResponse> {
    return this.apiPost('idea/create/', data, 'Required');
  }

  updateIdea(data: any): Observable<ApiResponse> {
    return this.apiPost('idea/update/', data, 'Required');
  }

  checkIfIdeaBelongsToUser(ideaId: number): Observable<boolean> {
    return this.apiGet('idea/checkifideabelongstouser/' + ideaId, 'Required').pipe(
      map(data => data.data.accessgranted)
    );
  }


  // -----------------------------------
  // Other
  // -----------------------------------


  uploadImage(file: any): Observable<any> {
    const dataFile = new FormData();
    dataFile.append('image', file);
    const headers = new HttpHeaders({ authorization: 'Client-ID c0df3b4f744766f' });
    return this.httpClient.post('https://api.imgur.com/3/image/', dataFile, { headers });
  }
}
