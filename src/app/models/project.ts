import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { User } from './user';

export class Project {

  id: number;
  public title: string;
  public body: any;
  public creationDate: Date;
  public startDate: Date;
  public releaseDate: Date;
  public logo: SafeResourceUrl;
  public shortDescription: string;
  public website: string;
  public owner: User;
  public screenshots: SafeResourceUrl[];

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.body = data.body;
    this.creationDate = data.creationdate;
    this.startDate = data.startdate;
    this.releaseDate = data.releasedate;
    this.logo = data.logo;
    this.shortDescription = data.short_description;
    this.website = data.website;
    this.owner = data.owner;
    this.screenshots = data.screenshots;
   }
}
