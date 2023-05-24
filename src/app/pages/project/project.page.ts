import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { ExternalHrefPipe } from 'src/app/pipes/external-href.pipe';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';
import SwiperCore, { EffectFade, EffectCards, Pagination, Swiper } from 'swiper';
import {register} from 'swiper/element/bundle';

SwiperCore.use([EffectFade, EffectCards, Pagination]);

@Component({
  selector: 'app-project',
  templateUrl: './project.page.html',
  styleUrls: ['./project.page.scss'],
})
export class ProjectPage implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('swiperRef')
  swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  subscriptions: Subscription[] = [];

  projectId: number;
  project: Project = null;

  currentUser: User = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!isNaN(+id)) {
      this.projectId = +id;
      const subscription1 = this.apiService.getProject(this.projectId).subscribe(project => {
        this.project = project;
        console.log('Project: ', this.project);
      });
      this.subscriptions.push(subscription1);
    }

    const subscription2 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.currentUser = latestUser;
    });
    this.subscriptions.push(subscription2);
  }

  ngAfterViewInit(): void {
    register();
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  gotoWebsite(url: string) {
    const pipe = new ExternalHrefPipe();
    url = pipe.transform(url);
    window.open(url, '_blank');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
