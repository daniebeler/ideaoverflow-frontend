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
    item.releasedate = new Date(item.release_date);
    item.logo = this.domSanitizer.bypassSecurityTrustResourceUrl(item.logo);
    item.body = this.domSanitizer.bypassSecurityTrustHtml(item.body);
    return new Project(item);
  }
}
