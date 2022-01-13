export class Post {

  public id: number;
  public title: string;
  public body: any;
  public creationDate: Date;
  public ownerUsername: string;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.creationDate = data.creationdate;
    this.ownerUsername = data.title;
   }
}
