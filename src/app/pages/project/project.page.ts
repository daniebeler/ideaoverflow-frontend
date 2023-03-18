import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project';
import { ExternalHrefPipe } from 'src/app/pipes/external-href.pipe';
import { ApiService } from 'src/app/services/api.service';
import SwiperCore, { EffectFade, EffectCards, Pagination, Swiper } from 'swiper';

SwiperCore.use([EffectFade, EffectCards, Pagination]);

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  projectId: number;
  project: Project = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!isNaN(+id)) {
      this.projectId = +id;
      this.subscriptions.push(
        this.apiService.getProject(this.projectId).subscribe(project => {
          this.project = project;
        })
      );
    }
  }

  gotoWebsite(url: string) {
    const pipe = new ExternalHrefPipe();
    url = pipe.transform(url);
    window.open(url, '_blank');
  }

  goBack() {
    this.router.navigate(['/projects']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
