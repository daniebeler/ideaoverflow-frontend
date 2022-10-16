import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ManagerService } from './services/manager.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private update: SwUpdate,
    public managerService: ManagerService
  ) { }

  updateClient() {
    if (!this.update.isEnabled) {
      console.log('Service Worker is not enabled');
      return;
    }
    this.update.versionUpdates.subscribe(event => {
      console.log(event);
      this.update.activateUpdate().then(() => { });
      location.reload();
      console.log('reloaded');
    });
  }
}
