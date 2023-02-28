import { SafeResourceUrl } from '@angular/platform-browser';

export class User {

  public id: number;
  public email: string;
  public username: string;
  public firstname: string;
  public lastname: string;
  public bio: string;
  public website: string;
  public github: string;
  public twitter: string;
  public instagram: string;
  public dribbble: string;
  public linkedin: string;
  public country: string;
  public state: string;
  public profileimage: SafeResourceUrl;
  public creationDate: Date;
  public numberOfFollowers: number;
  public numberOfFollowees: number;
  public numberOfPosts: number;
  public numberOfProjects: number;
  public numberOfLikes: number;
  public following: boolean;
  public color: string;

  constructor(data?: any) {
    this.id = data?.id;
    this.email = data?.email;
    this.username = data?.username;
    this.firstname = data?.firstname;
    this.lastname = data?.lastname;
    this.bio = data?.bio;
    this.website = data?.website;
    this.github = data?.github;
    this.twitter = data?.twitter;
    this.instagram = data?.instagram;
    this.dribbble = data?.dribbble;
    this.linkedin = data?.linkedin;
    this.country = data?.country;
    this.state = data?.state;
    this.profileimage = data?.profileimage;
    this.creationDate = data?.creationdate;
    this.numberOfFollowers = data?.numberOfFollowers ?? 0;
    this.numberOfFollowees = data?.numberOfFollowees ?? 0;
    this.numberOfPosts = data?.numberOfPosts ?? 0;
    this.numberOfProjects = data?.numberOfProjects ?? 0;
    this.numberOfLikes = data?.numberOfLikes ?? 0;
    this.following = data?.following ?? false;
    this.color = data?.color;
  }
}
