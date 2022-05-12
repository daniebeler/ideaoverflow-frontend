import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit {

  projectId: number;
  project: Project = null;

  currentUser: User = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private userService: UserService,
    private router: Router
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

    this.userService.getLatestUser()
      .subscribe((latestUser) => {
        this.currentUser = latestUser;
      });
  }

  editProject() {
    this.router.navigate(['projecteditor/' + this.project.id]);
  }
}
