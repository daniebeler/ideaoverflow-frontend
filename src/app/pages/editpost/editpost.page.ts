import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.page.html',
  styleUrls: ['./editpost.page.scss'],
})
export class EditpostPage {

  post: Post = null;

  constructor(
    private acitvatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.acitvatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.post = this.router.getCurrentNavigation().extras.state.post;
        this.post.body = this.post.body.changingThisBreaksApplicationSecurity;
      }
    });
  }
}
