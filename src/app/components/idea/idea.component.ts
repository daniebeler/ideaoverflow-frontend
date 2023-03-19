import { Component, Input } from '@angular/core';
import { Idea } from 'src/app/models/idea';
import { AlertService } from 'src/app/services/alert.service';
import { IdeaService } from 'src/app/services/idea.service';

@Component({
  selector: 'app-idea-component',
  templateUrl: './idea.component.html',
  styleUrls: ['./idea.component.scss'],
})
export class IdeaComponent {

  @Input() post: Idea = null;
  @Input() loggedIn = false;

  constructor(
    private alertService: AlertService,
    private ideaService: IdeaService
  ) { }

  votePost(voteValue: number, idea: Idea) {
    if (this.loggedIn) {
      this.ideaService.voteIdea(voteValue, idea.id);
      if (idea.currentUserVoteValue === -1) {
        if (voteValue === 0) {
          idea.numberOfDownvotes--;
        } else if (voteValue === 1) {
          idea.numberOfDownvotes--;
          idea.numberOfUpvotes++;
        }
      } else if (idea.currentUserVoteValue === 0) {
        if (voteValue === -1) {
          idea.numberOfDownvotes++;
        } else if (voteValue === 1) {
          idea.numberOfUpvotes++;
        }
      } else if (idea.currentUserVoteValue === 1) {
        if (voteValue === -1) {
          idea.numberOfDownvotes++;
          idea.numberOfUpvotes--;
        } else if (voteValue === 0) {
          idea.numberOfUpvotes--;
        }
      }
      idea.currentUserVoteValue = voteValue;
    } else {
      this.alertService.showToast('You have to be logged in to vote ideas');
    }
  }

  savePost(postId: number) {
    if (this.loggedIn) {
      this.ideaService.saveIdea(postId);
      this.post.saved = true;
    } else {
      this.alertService.showToast('You have to be logged in to save Ideas');
    }
  }

  unsavePost(postId: number) {
    if (this.loggedIn) {
      this.ideaService.unsaveIdea(postId);
      this.post.saved = false;
    } else {
      this.alertService.showToast('You have to be logged in to save Ideas');
    }
  }
}
