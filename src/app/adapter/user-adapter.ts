import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class UserAdapter implements Adapter<User> {
  adapt(item: any): User {
    item.creationdate = new Date(item.creationdate);
    return new User(item);
  }
}
