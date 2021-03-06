import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Project } from '../models/project';
import { Adapter } from './adapter';

@Injectable({
  providedIn: 'root',
})

export class ProjectAdapter implements Adapter<Project> {

  constructor(
    private domSanitizer: DomSanitizer
  ) { }

  adapt(item: any): Project {
    item.creationdate = new Date(item.creation_date);
    item.startdate = new Date(item.start_date);
    if (item.release_date) {
      item.releasedate = new Date(item.release_date);
    }

    if (item.screenshots) {
      item.screenshots.forEach(screenshot => {
        screenshot = this.domSanitizer.bypassSecurityTrustResourceUrl(screenshot);
      });
    }

    item.logo = this.domSanitizer.bypassSecurityTrustResourceUrl(item.logo);
    item.ownerImage = this.domSanitizer.bypassSecurityTrustResourceUrl(item.profileimage);
    item.body = this.domSanitizer.bypassSecurityTrustHtml(item.body);
    return new Project(item);
  }
}
