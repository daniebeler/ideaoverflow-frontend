import { Injectable } from '@angular/core';
import { concatMap, map, Observable, of } from 'rxjs';
import { IdeaAdapter } from '../adapter/idea-adapter';
import { Idea } from '../models/idea';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {

  constructor(
    private apiService: ApiService,
    private ideaAdapter: IdeaAdapter
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

  createIdea(idea: Idea): Observable<any> {
    const obj = {
      header: idea.title,
      body: idea.body.changingThisBreaksApplicationSecurity,
      userID: idea.user.id
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

  getIdea(id: number): Observable<Idea> {
    return this.apiService.getIdea(id);
  }

  getIdeas(data: any): Observable<Idea[]> {
    if (data.username) {
      const param = this.concatQueries(data.username, data);
      return this.apiService.getIdeasByUsername(param);
    } else {
      const param = this.concatQueries('', data);
      return this.apiService.getIdeas(param);
    }
  }

  concatQueries(base: string, data: any): string {
    if (data.take) {
      base = this.concatQuery(base, 'take', data.take);
    }

    if (data.skip) {
      base = this.concatQuery(base, 'skip', data.skip);
    }

    if (data.reverse) {
      base = this.concatQuery(base, 'reverse', data.reverse);
    }

    if (data.sort) {
      base = this.concatQuery(base, 'sort', data.sort);
    }

    return base;
  }

  concatQuery(param: string, query: string, value: string): string {
    const questionmark = param.includes('?') ? '&' : '?';
    param = param.concat(questionmark, query, '=', value);
    return param;
  }
}

