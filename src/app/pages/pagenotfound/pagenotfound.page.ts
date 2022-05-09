import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.page.html',
  styleUrls: ['./pagenotfound.page.scss'],
})
export class PagenotfoundPage {

  constructor(private router: Router) { }

  gotoHome() {
    this.router.navigate(['']);
  }
}
