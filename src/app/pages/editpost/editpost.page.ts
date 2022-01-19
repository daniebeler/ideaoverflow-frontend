import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-editpost',
  templateUrl: './editpost.page.html',
  styleUrls: ['./editpost.page.scss'],
})
export class EditpostPage implements OnInit {

  postId: number;
  post: Post = null;

  constructor(
    private acitvatedRoute: ActivatedRoute,
    private router: Router,
    private postService: PostService
  ) {
    this.acitvatedRoute.queryParams.subscribe(() => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.post = this.router.getCurrentNavigation().extras.state.post;
        this.post.body = this.post.body.changingThisBreaksApplicationSecurity;
      }
      console.log(this.post);
    });
  }

  ngOnInit() {
  }

}
