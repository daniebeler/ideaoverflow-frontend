import { SafeResourceUrl } from '@angular/platform-browser';
import { Comment } from './comment';
import { User } from './user';

export class Idea {

  public id: number;
  public title: string;
  public body: any;
  public creationDate: Date;
  public user: User;
  public numberOfUpvotes: number;
  public numberOfDownvotes: number;
  public currentUserVoteValue: number;
  public saved: boolean;
  public mine: boolean;
  public comments: Comment[];

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.creationDate = data.creationdate;
    this.user = data.user;
    this.numberOfUpvotes = data.upvotes;
    this.numberOfDownvotes = data.downvotes;
    this.currentUserVoteValue = data.votevalue;
    this.saved = data.saved;
    this.mine = data.mine ?? false;
    this.comments = data.comments ?? [];
   }
}
