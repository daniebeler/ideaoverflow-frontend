import { SafeUrl } from '@angular/platform-browser';

export class Post {

  public id: number;
  public title: string;
  public body: any;
  public creationDate: Date;
  public ownerId: number;
  public ownerUsername: string;
  public ownerImage: SafeUrl;
  public numberOfUpvotes: number;
  public numberOfDownvotes: number;
  public currentUserVoteValue: number;
  public saved: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.creationDate = data.creationdate;
    this.ownerId = data.ownerid;
    this.ownerUsername = data.username;
    this.ownerImage = data.ownerImage;
    this.numberOfUpvotes = data.upvotes;
    this.numberOfDownvotes = data.downvotes;
    this.currentUserVoteValue = data.votevalue;
    this.saved = data.saved;
   }
}
