import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Project } from 'src/app/models/project';
import { ApiService } from 'src/app/services/api.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import hash from 'object-hash';

@Component({
  selector: 'app-projecteditor',
  templateUrl: './projecteditor.page.html',
  styleUrls: ['./projecteditor.page.scss'],
})
export class ProjectEditorPage implements OnInit {

  project: Project = new Project([]);

  projectHash = '12';

  editorInstance: any = {};

  showSubmitButton = false;

  mode = '';

  constructor(
    private alertController: AlertController,
    private projectService: ProjectService,
    private userService: UserService,
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const urlslice = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlslice && urlslice === 'new') {
      this.mode = 'new';
      this.project.body = this.domSanitizer.bypassSecurityTrustHtml('');
    } else if (!isNaN(+urlslice)) {
      this.mode = 'edit';
      this.apiService.getProject(+urlslice).subscribe(project => {
        this.projectHash = hash(project);
        this.project = project;
      });
    }

    this.userService.getLatestUser().subscribe((latestUser) => {
      this.project.ownerId = latestUser.id;
    });
  }

  async saveProject() {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-two',
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
              if (res.status === 200) {
                this.router.navigate(['']);
              }
            });
          } else if (this.mode === 'edit') {
            this.projectService.updateProject(this.project).subscribe(res => {
              if (res.status === 200) {
                this.router.navigate(['']);
              }
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
      this.project.releaseDate = undefined;
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
    let show = false;
    if (this.project.title && this.project.shortDescription && this.project.body.changingThisBreaksApplicationSecurity) {
      if (this.mode === 'edit') {
        if (this.projectHash !== hash(this.project)) {
          show = true;
        }
      } else {
        show = true;
      }
    }

    this.showSubmitButton = show;
  }

}
