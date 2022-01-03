import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class PostAdapter implements Adapter<Post> {
  adapt(item: any): Post {
    return new Post(
      item.id,
      item.title,
      item.body,
      new Date(item.creation_date)
    );
  }
}
