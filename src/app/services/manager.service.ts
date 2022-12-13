import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ManagerService {

  public innerWidth: any;

  public showSidebar = true;

  constructor() {
    this.checkScreenWidth(window.innerWidth);
   }

  checkScreenWidth(width) {
    this.showSidebar = width > 800;
  }
}
