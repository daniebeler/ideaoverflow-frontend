import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchTerm = '';
  postsHeader = '';

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.searchTerm = this.activatedRoute.snapshot.paramMap.get('search');
    this.postsHeader = 'Results for "' + this.searchTerm + '"';
  }

}
