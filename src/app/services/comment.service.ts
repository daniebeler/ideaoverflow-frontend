import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(
    private apiService: ApiService
  ) { }

  getCommentsOfIdea(ideaId: number): Observable<Comment[]> {
    const parameter = ideaId.toString();
    return this.apiService.getCommentsByIdeaId(parameter);
  }

  saveCommentOfIdea(ideaId: number, comment: string): Observable<any> {
    const req = {
      comment,
      ideaId
    };

    return this.apiService.createComment(req);
  }

  deleteComment(commentId: number) {
    return this.apiService.deleteComment(commentId);
  }
}
