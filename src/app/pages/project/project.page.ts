import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {

  projectId: number;
  project: Project = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!isNaN(+id)) {
      this.projectId = +id;
      this.apiService.getProject(this.projectId).subscribe(project => {
        this.project = project;
        console.log(this.project);
      });
    }
  }

}
