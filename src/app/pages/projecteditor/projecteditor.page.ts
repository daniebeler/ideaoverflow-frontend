import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ApiService } from 'src/app/services/api.service';
import { ProjectService } from 'src/app/services/project.service';
import { UserService } from 'src/app/services/user.service';
import hash from 'object-hash';
import { filter, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AlertService } from 'src/app/services/alert.service';

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

  verifiedAccess = false;

  showSubmitButton = false;

  mode = '';

  releaseDate: any;

  constructor(
    private alertService: AlertService,
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
      this.verifiedAccess = true;
      this.project.body = this.domSanitizer.bypassSecurityTrustHtml('');
      this.subscriptions.push(this.userService.getLatestUser().pipe(filter(user => Boolean(user))).subscribe((latestUser) => {
        this.project.user = latestUser;
      }));
    } else if (!isNaN(+urlslice)) {
      this.mode = 'edit';
      this.subscriptions.push(
        this.apiService.getProject(+urlslice)
          .pipe(filter(project => Boolean(project)))
          .subscribe(project => {
            this.projectHash = hash(project);
            this.project = project;
            this.verifiedAccess = project.mine;
            this.releaseDate = this.datePipe.transform(project.releaseDate, 'yyyy-MM-dd');
          })
      );
    }

    this.project.screenshots = [];
  }

  async saveProject() {
    this.alertService.showAlert(
      'Are you sure?',
      '',
      'Okay',
      () => {
        if (this.mode === 'new') {
          this.subscriptions.push(this.projectService.createProject(this.project).subscribe(async res => {
            this.redirect(res);
          }));
        } else if (this.mode === 'edit') {
          this.subscriptions.push(this.projectService.updateProject(this.project).subscribe(res => {
            this.redirect(res);
          }));
        }
      },
      'Back'
    );
  }

  async redirect(res) {
    this.alertService.showAlert(
      res.header,
      res.message,
      'Okay',
      () => {
        if (res.status === 200) {
          if (res.id === -1) {
            this.router.navigate(['projects/' + this.project.id]);
          } else {
            this.router.navigate(['projects/' + res.id]);
          }
        }
      }
    );
  }

  onFileChange(event) {
    if (event.target.files != null) {
      const file = event.target.files[0];
      if (file != null) {
        this.subscriptions.push(this.apiService.uploadImage(file).subscribe((res: any) => {
          if (res.data.link) {
            this.project.logo = this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link);
            this.updateSubmitButtonState();
          }
        }));
      }
    }
  }

  onScreenshotChange(event) {
    if (event.target.files != null) {
      const file = event.target.files[0];
      if (file != null) {
        this.subscriptions.push(this.apiService.uploadImage(file).subscribe((res: any) => {
          if (res.data.link) {
            this.project.screenshots.push(this.domSanitizer.bypassSecurityTrustResourceUrl(res.data.link));
            this.updateSubmitButtonState();
          }
        }));
      }
    }
  }

  releaseDateChanged(event: any) {
    if (event.target.value) {
      this.project.releaseDate = new Date(event.target.value);
      this.project.releaseDate.setHours(0, 0, 0, 0);
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
              this.subscriptions.push(this.apiService.uploadImage(file).subscribe((res: any) => {
                data.insertEmbed(range.index, 'image', res.data.link);
              }));
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

  goBack() {
    this.router.navigate(['projects']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
