import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { ExternalHrefPipe } from 'src/app/pipes/external-href.pipe';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {

  user: User = null;

  constructor(
    private apiService: ApiService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.apiService.getUser(this.activatedRoute.snapshot.paramMap.get('username')).subscribe(res => {
      this.user = res;
    });
  }

  gotoWebsite(url: string) {
    const pipe = new ExternalHrefPipe();
    url = pipe.transform(url);
    window.open(url, '_blank');
  }

}
