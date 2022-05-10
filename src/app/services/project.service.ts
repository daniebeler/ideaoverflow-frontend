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
    const obj = {
      title: project.title,
      short_description: project.shortDescription,
      owner_id: project.ownerId
    };
    return this.apiService.createProject(obj);
  }
}
