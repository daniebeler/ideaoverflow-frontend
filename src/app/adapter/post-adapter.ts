import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Post } from '../models/post';
import { SanitizerService } from '../services/sanitizer.service';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class PostAdapter implements Adapter<Post> {

  constructor(
    private sanitizerService: SanitizerService,
    private domSanitizer: DomSanitizer
    ) { }

  adapt(item: any): Post {
    item.creationdate = new Date(item.creation_date);
    item.ownerImage = this.sanitizerService.getSanitizedUrlFromArrayBuffer(item.profileimage);
    item.body = this.domSanitizer.bypassSecurityTrustHtml(item.body);
    item.votevalue = item.votevalue ? item.votevalue : 0;
    item.saved = item.saved ? true : false;
    return new Post(item);
  }
}
