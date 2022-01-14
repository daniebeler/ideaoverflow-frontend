import { SafeUrl } from '@angular/platform-browser';

export class Post {

  public id: number;
  public title: string;
  public body: any;
  public creationDate: Date;
  public ownerUsername: string;
  public ownerImage: SafeUrl;
  public numberOfUpvotes: number;
  public numberOfDownvotes: number;
  public currentUserVoteValue: number;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.creationDate = data.creationdate;
    this.ownerUsername = data.username;
    this.ownerImage = data.ownerImage;
    this.numberOfUpvotes = data.upvotes;
    this.numberOfDownvotes = data.downvotes;
    this.currentUserVoteValue = data.votevalue;
   }
}
