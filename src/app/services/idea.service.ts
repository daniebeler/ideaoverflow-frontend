import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Idea } from '../models/idea';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {

  constructor(
    private apiService: ApiService
  ) { }

  voteIdea(voteValue: number, ideaId: number, userId: number) {
    this.apiService.voteIdea(voteValue, ideaId, userId).subscribe(() => {
    });
  }

  saveIdea(ideaId: number, userId: number) {
    this.apiService.saveIdea(ideaId, userId).subscribe(() => {
    });
  }

  unsaveIdea(ideaId: number, userId: number) {
    this.apiService.unsaveIdea(ideaId, userId).subscribe(() => {
    });
  }

  createIdea(idea: Idea): Observable<any> {
    const obj = {
      header: idea.title,
      body: idea.body.changingThisBreaksApplicationSecurity,
      userID: idea.ownerId
    };
    return this.apiService.createIdea(obj);
  }

  updateIdea(idea: Idea): Observable<any> {
    const obj = {
      title: idea.title,
      body: idea.body.changingThisBreaksApplicationSecurity,
      ideaId: idea.id
    };
    return this.apiService.updateIdea(obj);
  }
}

