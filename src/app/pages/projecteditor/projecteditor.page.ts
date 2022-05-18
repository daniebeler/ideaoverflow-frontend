import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Project } from 'src/app/models/project';
import { ApiService } from 'src/app/services/api.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import hash from 'object-hash';
import { filter, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-projecteditor',
  templateUrl: './projecteditor.page.html',
  styleUrls: ['./projecteditor.page.scss'],
})
export class ProjectEditorPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  project: Project = new Project([]);

  projectHash = '12';

  editorInstance: any = {};

  showSubmitButton = false;

  mode = '';

  releaseDate: any;

  constructor(
    private alertController: AlertController,
    private projectService: ProjectService,
    private userService: UserService,
    private apiService: ApiService,
    private domSanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    const urlslice = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlslice && urlslice === 'new') {
      this.mode = 'new';
      this.project.body = this.domSanitizer.bypassSecurityTrustHtml('');
      const subscription1 = this.userService.getLatestUser().pipe(filter(user => Boolean(user))).subscribe((latestUser) => {
        this.project.ownerId = latestUser.id;
      });
      this.subscriptions.push(subscription1);
    } else if (!isNaN(+urlslice)) {
      this.mode = 'edit';
      const subscription2 = this.apiService.getProject(+urlslice).pipe(filter(project => Boolean(project))).subscribe(project => {
        this.projectHash = hash(project);
        this.project = project;
        this.releaseDate = this.datePipe.transform(project.releaseDate, 'yyyy-MM-dd');
      });
      this.subscriptions.push(subscription2);
    }
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
            const subscription3 = this.projectService.createProject(this.project).subscribe(async res => {
              console.log(res);
              this.redirect(res);
            });
            this.subscriptions.push(subscription3);
          } else if (this.mode === 'edit') {
            const subscription4 = this.projectService.updateProject(this.project).subscribe(res => {
              console.log(res);
              this.redirect(res);
            });
            this.subscriptions.push(subscription4);
          }
        }
      }]
    });
    await alert.present();
  }

  async redirect(res) {
    const alert = await this.alertController.create({
      cssClass: 'custom-alert-ok',
      backdropDismiss: false,
      header: res.header,
      message: res.message,
      buttons: [{
        text: 'Okay',
        role: 'ok',
        handler: () => {
          if (res.status === 200) {
            this.router.navigate(['']);
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
        const subscription5 = this.apiService.uploadImage(file).subscribe((res: any) => {
          if (res.data.link) {
            this.project.logo = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            this.updateSubmitButtonState();
          }
        });
        this.subscriptions.push(subscription5);
      }
    }
  }

  releaseDateChanged(event: any) {
    if (event.target.value) {
      this.project.releaseDate = new Date(event.target.value);
      this.project.releaseDate.setHours(0, 0, 0, 0);
      console.log(this.project.releaseDate);
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
              const subscription6 = this.apiService.uploadImage(file).subscribe((res: any) => {
                data.insertEmbed(range.index, 'image', res.data.link);
              });
              this.subscriptions.push(subscription6);
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
