import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Project } from '../models/project';
import { User } from '../models/user';
import { Adapter } from './adapter';
import { UserAdapter } from './user-adapter';

@Injectable({
  providedIn: 'root',
})
export class ProjectAdapter implements Adapter<Project> {
  constructor(
    private domSanitizer: DomSanitizer,
    private userAdapter: UserAdapter
  ) {}

  adapt(item: any): Project {
    item.creationdate = new Date(item.creation_date);
    item.startdate = new Date(item.start_date);
    if (item.release_date) {
      item.releasedate = new Date(item.release_date);
    }

    if (item.screenshot) {
      item.screenshots = item.screenshot.map((screenshot) => this.domSanitizer.bypassSecurityTrustResourceUrl(screenshot.url));
    }

    item.logo = this.domSanitizer.bypassSecurityTrustResourceUrl(item.logo);
    item.body = this.domSanitizer.bypassSecurityTrustHtml(item.body);
    item.owner = this.userAdapter.adapt(item.user);
    return new Project(item);
  }
}
