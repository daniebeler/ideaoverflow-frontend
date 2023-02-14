import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Idea } from 'src/app/models/idea';
import { IdeaService } from 'src/app/services/idea.service';

@Component({
  selector: 'app-idea',
  templateUrl: './idea.component.html',
  styleUrls: ['./idea.component.scss'],
})
export class IdeaComponent implements OnInit {

  @Input() post: Idea = null;
  @Input() loggedIn = false;
  @Input() isOwnPost = false;

  constructor(
    private toastController: ToastController,
    private ideaService: IdeaService
  ) { }

  ngOnInit() {}

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
      this.presentToast('You have to be logged in to vote ideas');
    }
  }

  savePost(postId: number) {
    if (this.loggedIn) {
      this.ideaService.saveIdea(postId);
      this.post.saved = true;
    } else {
      this.presentToast('You have to be logged in to save Ideas');
    }
  }

  unsavePost(postId: number) {
    if (this.loggedIn) {
      this.ideaService.unsaveIdea(postId);
      this.post.saved = false;
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

}
