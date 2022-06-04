import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Idea } from '../models/idea';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class IdeaAdapter implements Adapter<Idea> {

  constructor(
    private domSanitizer: DomSanitizer
    ) { }

  adapt(item: any): Idea {
    item.creationdate = new Date(item.creation_date);
    item.ownerImage = this.domSanitizer.bypassSecurityTrustResourceUrl(item.profileimage);
    item.body = this.domSanitizer.bypassSecurityTrustHtml(item.body);
    item.votevalue = item.votevalue ? item.votevalue : 0;
    item.saved = item.saved ? true : false;
    return new Idea(item);
  }
}
