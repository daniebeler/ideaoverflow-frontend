/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private apiService: ApiService
  ) { }

  createProject(project: Project) {
    const logo: any = project.logo;
    const obj = {
      title: project.title,
      short_description: project.shortDescription,
      body: project.body,
      owner_id: project.ownerId,
      logo: logo.changingThisBreaksApplicationSecurity,
      website: project.website
    };
    return this.apiService.createProject(obj);
  }
}
