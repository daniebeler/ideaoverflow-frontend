import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { Idea } from '../models/idea';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {

  constructor(
    private apiService: ApiService
  ) { }

  voteIdea(voteValue: number, ideaId: number) {
    this.apiService.voteIdea(voteValue, ideaId).subscribe(() => {
    });
  }

  saveIdea(ideaId: number) {
    this.apiService.saveIdea(ideaId).subscribe(() => {
    });
  }

  unsaveIdea(ideaId: number) {
    this.apiService.unsaveIdea(ideaId).subscribe(() => {
    });
  }

  createIdea(title: string, description: string): Observable<ApiResponse> {
    const obj = {
      header: title,
      body: description
    };
    return this.apiService.createIdea(obj);
  }

  updateIdea(ideaId: number, title: string, description: string): Observable<ApiResponse> {
    const obj = {
      title,
      body: description,
      ideaId
    };
    return this.apiService.updateIdea(obj);
  }

  getIdea(id: number): Observable<Idea> {
    return this.apiService.getIdea(id);
  }

  getIdeas(data: any): Observable<Idea[]> {
    if (data.username) {
      const param = this.apiService.concatQueries(data.username, data);
      return this.apiService.getIdeasByUsername(param);
    } else if (data.savedByUsername) {
      const param = this.apiService.concatQueries('', data);
      return this.apiService.getIdeasSavedByUser(param);
    } else {
      const param = this.apiService.concatQueries('', data);
      return this.apiService.getIdeas(param);
    }
  }

  getSavedIdeas(data: any): Observable<Idea[]> {
    const param = this.apiService.concatQueries(data.userId, data);
      return this.apiService.getIdeasByUsername(param);
  }
}

