import { Injectable } from '@angular/core';
import { Adapter } from './adapter';
import { Comment } from '../models/comment';
import { UserAdapter } from './user-adapter';

@Injectable({
  providedIn: 'root',
})

export class CommentAdapter implements Adapter<Comment> {

  constructor(
    private userAdapter: UserAdapter
  ) { }

  adapt(item: any): Comment {

    item.creation_date = new Date(item.creation_date);
    item.user = this.userAdapter.adapt(item.user);

    return new Comment(item.id, item.user, item.body, item.mine, item.creation_date, item.idea_id, item.project_id);
  }
}
