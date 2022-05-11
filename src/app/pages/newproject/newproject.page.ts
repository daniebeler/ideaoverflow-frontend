import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AlertController } from '@ionic/angular';
import { Project } from 'src/app/models/project';
import { ApiService } from 'src/app/services/api.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-newproject',
  templateUrl: './newproject.page.html',
  styleUrls: ['./newproject.page.scss'],
})
export class NewprojectPage implements OnInit {

  logo: SafeResourceUrl;
  title: string;
  shortDescription: string;
  project: Project = new Project([]);

  constructor(
    private alertController: AlertController,
    private projectService: ProjectService,
    private userService: UserService,
    private apiService: ApiService,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.userService.getLatestUser().subscribe((latestUser) => {
      this.project.ownerId = latestUser.id;
    });
  }

  async saveProject() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-ok',
      backdropDismiss: false,
      header: 'Are you sure?',
      buttons: [{
        text: 'Back'
      }, {
        text: 'Okay',
        role: 'ok',
        handler: () => {
          this.projectService.createProject(this.project).subscribe(async res => {
            // this.redirect(res);
            console.log('created');
          });
        }
      }]
    });
    await alert.present();
  }

  onFileChange(event) {
    if (event.target.files != null) {
      const file = event.target.files[0];
      if (file != null) {
        this.apiService.uploadImage(file).subscribe((res: any) => {
          if (res.data.link) {
            this.logo = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            // this.checkForChange();
          }
        });
      }
    }
  }

}
