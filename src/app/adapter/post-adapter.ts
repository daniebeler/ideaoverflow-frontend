import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class PostAdapter implements Adapter<Post> {
  adapt(item: any): Post {
    item.creationdate = new Date(item.creation_date);
    return new Post(item);
  }
}
