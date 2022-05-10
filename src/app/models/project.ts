import { SafeResourceUrl } from '@angular/platform-browser';

export class Project {

  public id: number;
  public title: string;
  public body: any;
  public creationDate: Date;
  public startDate: Date;
  public releaseDate: Date;
  public logo: SafeResourceUrl;
  public shortDescription: string;
  public ownerId: number;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.creationDate = data.creationdate;
    this.startDate = data.startdate;
    this.releaseDate = data.releasedate;
    this.logo = data.logo;
    this.shortDescription = data.short_description;
    this.ownerId = data.owner_id;
   }
}
