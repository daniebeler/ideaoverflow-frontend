import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {

  numberOfTotalPosts = 0;
  numberOfTotalUsers = 0;

  constructor(
    private postService: PostService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.postService.getNumberOfTotalPosts().subscribe(numberOfTotalPosts => {
      this.numberOfTotalPosts = numberOfTotalPosts;
    });

    this.apiService.getNumberOfTotalUsers().subscribe(numberOfTotalUsers => {
      this.numberOfTotalUsers = numberOfTotalUsers;
    });
  }

}
