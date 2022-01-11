import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { User } from '../models/user';
import { SanitizerService } from '../services/sanitizer.service';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class UserAdapter implements Adapter<User> {

  constructor(private sanitizerService: SanitizerService) { }

  adapt(item: any): User {
    item.creationdate = new Date(item.creationdate);
    item.profileimage = this.sanitizerService.getSanitizedUrlFromArrayBuffer(item.profileimage);
    return new User(item);
  }
}
