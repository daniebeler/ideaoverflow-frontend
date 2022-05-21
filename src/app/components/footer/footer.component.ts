import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  numberOfTotalPosts = 0;
  numberOfTotalUsers = 0;
  numberOfTotalProjects = 0;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const subscription1 = this.apiService.getNumberOfTotalIdeas().subscribe(numberOfTotalPosts => {
      this.numberOfTotalPosts = numberOfTotalPosts;
    });

    const subscription2 = this.apiService.getNumberOfTotalUsers().subscribe(numberOfTotalUsers => {
      this.numberOfTotalUsers = numberOfTotalUsers;
    });

    const subscription3 = this.apiService.getNumberOfTotalProjects().subscribe(numberOfTotalProjects => {
      this.numberOfTotalProjects = numberOfTotalProjects;
    });

    this.subscriptions.push(subscription1, subscription2, subscription3);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
