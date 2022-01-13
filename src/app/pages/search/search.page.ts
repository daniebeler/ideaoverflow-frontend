import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  postsHeader = '';

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.postsHeader = 'Results for "' + this.activatedRoute.snapshot.paramMap.get('search') + '"';
  }

}
