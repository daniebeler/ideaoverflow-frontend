import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { SanitizerService } from '../services/sanitizer.service';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class PostAdapter implements Adapter<Post> {

  constructor(private sanitizerService: SanitizerService) { }

  adapt(item: any): Post {
    item.creationdate = new Date(item.creation_date);
    item.ownerImage = this.sanitizerService.getSanitizedUrlFromArrayBuffer(item.profileimage);
    item.votevalue = item.votevalue ? item.votevalue : 0;
    console.log(item);
    return new Post(item);
  }
}
