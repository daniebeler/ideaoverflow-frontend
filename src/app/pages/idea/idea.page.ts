import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Idea } from 'src/app/models/idea';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { CommentService } from 'src/app/services/comment.service';
import { IdeaService } from 'src/app/services/idea.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-idea',
  templateUrl: './idea.page.html',
  styleUrls: ['./idea.page.scss'],
})
export class IdeaPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  idea: Idea = null;

  currentUser: User = null;

  commentForm: FormGroup;
  sending = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private ideaService: IdeaService,
    private alertService: AlertService,
    private commentService: CommentService,
    private router: Router
  ) {
    this.commentForm = new FormGroup({
      comment: new FormControl<string | null>('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)])
    });
   }

   get comment() {
    return this.commentForm.get('comment');
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (!isNaN(+id)) {
      this.subscriptions.push(this.ideaService.getIdea(+id).subscribe(idea => {
        this.idea = idea;

        this.loadComments();
      }));
    }

    this.subscriptions.push(this.userService.getLatestUser().subscribe((latestUser) => {
      this.currentUser = latestUser;
    }));
  }

  loadComments() {
    this.subscriptions.push(this.commentService.getCommentsOfIdea(this.idea.id).subscribe(comments => {
      this.idea.comments = comments;
    }));
  }

  votePost(voteValue: number, idea: Idea) {
    if (this.currentUser) {
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
    if (this.currentUser) {
      this.ideaService.saveIdea(postId);
      this.idea.saved = true;
    } else {
      this.alertService.showToast('You have to be logged in to save Ideas');
    }
  }

  unsavePost(postId: number) {
    if (this.currentUser) {
      this.ideaService.unsaveIdea(postId);
      this.idea.saved = false;
    } else {
      this.alertService.showToast('You have to be logged in to save Ideas');
    }
  }

  goBack() {
    this.router.navigate(['/ideas']);
  }

  sendComment() {
    if (this.comment.valid && !this.sending) {
      console.log(this.comment.value);
      this.sending = true;
      this.commentService.saveCommentOfIdea(this.idea.id, this.comment.value).subscribe(res => {
        console.log(res);
        this.sending = false;
        this.comment.setValue('');
        this.loadComments();
      });
    }
  }

  deleteComment(commentId: number) {
    this.alertService.showAlert('Are you sure?', 'Your comment will be deleted', 'Okay', () => {
      this.commentService.deleteComment(commentId).subscribe(res => {
        if (res.status === 'OK') {
          this.loadComments();
        }
      });
    }, 'Cancel');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
