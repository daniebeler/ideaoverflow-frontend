import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Idea } from '../models/idea';
import { Adapter } from './adapter';
import { UserAdapter } from './user-adapter';

@Injectable({
  providedIn: 'root',
})

export class IdeaAdapter implements Adapter<Idea> {

  constructor(
    private domSanitizer: DomSanitizer,
    private userAdapter: UserAdapter
    ) { }

  adapt(item: any): Idea {
    item.creationdate = new Date(item.creation_date);
    item.body = this.domSanitizer.bypassSecurityTrustHtml(item.body);
    item.votevalue = item.votevalue ? item.votevalue : 0;
    item.saved = item.saved ? true : false;
    item.user = this.userAdapter.adapt(item.user);
    return new Idea(item);
  }
}
