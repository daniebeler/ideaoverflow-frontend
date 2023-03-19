import { User } from './user';

export class Comment {

  public id: number;
  public user: User;
  public ideaId: number;
  public projectId: number;
  public body: string;
  public mine: boolean;
  public creationDate: Date;

  constructor(id: number, user: User, body: string, mine: boolean, creationDate: Date, ideaId?: number, projectId?: number) {
    this.id = id;
    this.user = user;
    this.ideaId = ideaId;
    this.projectId = projectId;
    this.body = body;
    this.mine = mine ?? false;
    this.creationDate = creationDate;
  }
}
