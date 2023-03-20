import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Comment } from 'src/app/models/comment';
import { Idea } from 'src/app/models/idea';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert.service';
import { CommentService } from 'src/app/services/comment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements OnInit, OnDestroy {

  @Input() idea: Idea;
  @Input() project: Project;

  subscriptions: Subscription[] = [];

  comments: Comment[] = [];

  commentForm: FormGroup;
  sending = false;

  currentUser: User = null;

  constructor(
    private commentService: CommentService,
    private alertService: AlertService,
    private userService: UserService
  ) {
    this.commentForm = new FormGroup({
      comment: new FormControl<string | null>('', [Validators.required, Validators.minLength(1), Validators.maxLength(255)])
    });
  }

  get comment() {
    return this.commentForm.get('comment');
  }

  ngOnInit() {
    this.subscriptions.push(this.userService.getLatestUser().subscribe((latestUser) => {
      this.currentUser = latestUser;
    }));

    this.loadComments();
  }

  loadComments() {
    if (this.idea) {
      this.subscriptions.push(this.commentService.getCommentsOfIdea(this.idea.id).subscribe(comments => {
        this.comments = comments;
      }));
    } else if (this.project) {
      this.subscriptions.push(this.commentService.getCommentsOfProject(this.project.id).subscribe(comments => {
        this.comments = comments;
      }));
    }
  }

  sendComment() {
    if (this.comment.valid && !this.sending) {
      this.sending = true;
      if (this.idea) {
        this.commentService.saveCommentOfIdea(this.idea.id, this.comment.value).subscribe(res => {
          this.sending = false;
          this.comment.setValue('');
          this.loadComments();
        });
      } else if (this.project) {
        this.commentService.saveCommentOfProject(this.project.id, this.comment.value).subscribe(res => {
          this.sending = false;
          this.comment.setValue('');
          this.loadComments();
        });
      }
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

  showNotLoggedInWarning() {
    this.alertService.showToast('Please log in to post comments');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
