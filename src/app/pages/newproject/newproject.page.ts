import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
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

  @Input() body: any = '';

  project: Project = new Project([]);

  editorInstance: any = {};

  showSubmitButton = false;

  mode = '';

  constructor(
    private alertController: AlertController,
    private projectService: ProjectService,
    private userService: UserService,
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const urlslice = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlslice && urlslice === 'new') {
      this.mode = 'new';
    } else if (!isNaN(+urlslice)) {
      this.mode = 'edit';
      this.apiService.getProject(+urlslice).subscribe(project => {
        console.log(project);
        this.project = project;
      });
    }

    this.userService.getLatestUser().subscribe((latestUser) => {
      this.project.ownerId = latestUser.id;
    });
  }

  async saveProject() {
    console.log(this.project);

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
          if (this.mode === 'new') {
            this.projectService.createProject(this.project).subscribe(async res => {
              // this.redirect(res);
              console.log('created');
            });
          } else if (this.mode === 'edit') {
            this.projectService.updateProject(this.project).subscribe(res => {
              console.log('updated');
            });
          }

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
            this.project.logo = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            this.updateSubmitButtonState();
          }
        });
      }
    }
  }

  releaseDateChanged(event: any) {
    if (event.target.value) {
      this.project.releaseDate = new Date(event.target.value);
    } else {
      this.project.releaseDate = null;
    }

    this.updateSubmitButtonState();
  }

  editor(quill: any) {
    this.editorInstance = quill;
    const toolbar = quill.getModule('toolbar');
    toolbar.addHandler('image', this.imageEditor.bind(this));
  }

  imageEditor() {
    const data: any = this.editorInstance;
    if (this.editorInstance != null) {
      const range = this.editorInstance.getSelection();
      if (range != null) {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.addEventListener('change', () => {
          if (input.files != null) {
            const file = input.files[0];
            if (file != null) {
              this.apiService.uploadImage(file).subscribe((res: any) => {
                data.insertEmbed(range.index, 'image', res.data.link);
              });
            }
          }
        });
        input.click();
      }
    }
  }

  updateSubmitButtonState() {
    console.log(this.project);
    console.log('change');
    let show = false;
    if (this.project.title && this.project.shortDescription && this.project.body.changingThisBreaksApplicationSecurity) {
      if (this.mode === 'edit') {
        // check for changes
        show = true;
      } else {
        show = true;
      }
    }

    this.showSubmitButton = show;
  }

}
