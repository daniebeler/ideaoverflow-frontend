import { User } from './user';

export class Comment {

  public id: number;
  public user: User;
  public ideaId: number;
  public projectId: number;
  public body: string;
  public mine: boolean;

  constructor(id: number, user: User, body: string, mine: boolean, ideaId?: number, projectId?: number) {
    this.id = id;
    this.user = user;
    this.ideaId = ideaId;
    this.projectId = projectId;
    this.body = body;
    this.mine = mine ?? false;
  }
}
