import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Idea } from 'src/app/models/idea';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-idea',
  templateUrl: './idea.page.html',
  styleUrls: ['./idea.page.scss'],
})
export class IdeaPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  ideaId: number;
  idea: Idea = null;

  currentUser: User = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!isNaN(+id)) {
      this.ideaId = +id;
      const subscription1 = this.apiService.getIdea(this.ideaId).subscribe(idea => {
        this.idea = idea;
        console.log(idea);
      });
      this.subscriptions.push(subscription1);
    }

    const subscription2 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.currentUser = latestUser;
    });
    this.subscriptions.push(subscription2);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
