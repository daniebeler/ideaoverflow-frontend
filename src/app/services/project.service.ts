/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

    let releaseDate = null;

    if(project.releaseDate) {
      releaseDate = project.releaseDate.toISOString().slice(0, 10);
    }

    const screens: any = project.screenshots;
    const screenshots = [];

    screens.forEach(screenshot => {
      screenshots.push(screenshot.changingThisBreaksApplicationSecurity);
    });

    const data = {
      title: project.title,
      short_description: project.shortDescription,
      body: project.body.changingThisBreaksApplicationSecurity,
      owner_id: project.ownerId,
      // logo: logo.changingThisBreaksApplicationSecurity,
      website: project.website,
      release_date: releaseDate,
      screenshots
    };
    return this.apiService.createProject(data);
  }

  updateProject(updatedProject: Project): Observable<any> {
    const url: any = updatedProject.logo;

    let releaseDate = null;
    let startDate = null;

    if(updatedProject.releaseDate) {
      releaseDate = updatedProject.releaseDate.toISOString().slice(0, 10);
    }

    if(updatedProject.startDate) {
      startDate = updatedProject.startDate.toISOString().slice(0, 10);
    }

    const dataToUpdate = {
      id: updatedProject.id,
      title: updatedProject.title,
      body: updatedProject.body.changingThisBreaksApplicationSecurity,
      start_date: startDate,
      release_date: releaseDate,
      logo: url.changingThisBreaksApplicationSecurity,
      short_description: updatedProject.shortDescription,
      website: updatedProject.website
    };
    return this.apiService.updateProject(dataToUpdate);
  }
}
