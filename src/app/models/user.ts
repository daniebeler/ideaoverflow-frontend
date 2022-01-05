export class User {

  public id: number;
  public email: string;
  public username: string;
  public firstname: string;
  public lastname: string;
  public website: string;
  public github: string;
  public twitter: string;
  public instagram: string;
  public dribbble: string;
  public linkedin: string;
  public isPrivate: boolean;
  public country: string;
  public state: string;
  public profileimage: any;
  public creationDate: Date;
  public numberOfFollowers: number;
  public numberOfFollowees: number;

  constructor(data: any) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.firstname = data.firstname;
    this.lastname = data.lastname;
    this.website = data.website;
    this.github = data.github;
    this.twitter = data.twitter;
    this.instagram = data.instagram;
    this.dribbble = data.dribbble;
    this.linkedin = data.linkedin;
    this.isPrivate = data.private;
    this.country = data.country;
    this.state = data.state;
    this.profileimage = data.profileimage;
    this.creationDate = data.creationdate;
    this.numberOfFollowers = data.followers;
    this.numberOfFollowees = data.followees;
   }
}

