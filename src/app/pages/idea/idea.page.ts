import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Idea } from 'src/app/models/idea';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { IdeaService } from 'src/app/services/idea.service';
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
    private userService: UserService,
    private ideaService: IdeaService,
    private toastController: ToastController
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

  votePost(voteValue: number, idea: Idea) {
    if (this.currentUser) {
      this.ideaService.voteIdea(voteValue, idea.id, this.currentUser.id);
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
      this.presentToast('You have to be logged in to vote ideas');
    }
  }

  savePost(postId: number) {
    if (this.currentUser) {
      this.ideaService.saveIdea(postId, this.currentUser.id);
      this.idea.saved = true;
    } else {
      this.presentToast('You have to be logged in to save Ideas');
    }
  }

  unsavePost(postId: number) {
    if (this.currentUser) {
      this.ideaService.unsaveIdea(postId, this.currentUser.id);
      this.idea.saved = false;
    } else {
      this.presentToast('You have to be logged in to save Ideas');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      icon: 'information-circle',
      color: 'primary',
      duration: 2500
    });
    toast.present();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
