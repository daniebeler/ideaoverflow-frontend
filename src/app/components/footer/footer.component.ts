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

  numberOfTotalIdeas = 0;
  numberOfTotalUsers = 0;
  numberOfTotalProjects = 0;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.apiService.getNumberOfTotalIdeas().subscribe(numberOfTotalIdeas => {
      this.numberOfTotalIdeas = numberOfTotalIdeas;
    }));

    this.subscriptions.push(this.apiService.getNumberOfTotalUsers().subscribe(numberOfTotalUsers => {
      this.numberOfTotalUsers = numberOfTotalUsers;
    }));

    this.subscriptions.push(this.apiService.getNumberOfTotalProjects().subscribe(numberOfTotalProjects => {
      this.numberOfTotalProjects = numberOfTotalProjects;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
