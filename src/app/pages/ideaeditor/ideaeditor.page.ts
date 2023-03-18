import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Idea } from 'src/app/models/idea';
import { ApiService } from 'src/app/services/api.service';
import { IdeaService } from 'src/app/services/idea.service';
import hash from 'object-hash';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-ideaeditor',
  templateUrl: './ideaeditor.page.html',
  styleUrls: ['./ideaeditor.page.scss'],
})
export class IdeaEditorPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  idea: Idea = new Idea([]);

  verifiedAccess = false;

  postHash = '12';

  editorInstance: any = {};

  showSubmitButton = false;

  mode = '';

  constructor(
    private router: Router,
    private ideaService: IdeaService,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private apiService: ApiService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    const urlslice = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlslice && urlslice === 'new') {
      this.mode = 'new';
      this.verifiedAccess = true;
      this.idea.body = this.domSanitizer.bypassSecurityTrustHtml('');
    } else if (!isNaN(+urlslice)) {
      this.mode = 'edit';
      this.subscriptions.push(this.ideaService.getIdea(+urlslice).subscribe(post => {
        this.verifiedAccess = post.mine;
        this.postHash = hash(post);
        this.idea = post;
      }));
    }
  }

  async savePost() {
    this.alertService.showAlert('Are you sure?',
      '',
      'Okay',
      () => {
        if (this.mode === 'new') {
          this.subscriptions.push(this.ideaService.createIdea(this.idea).subscribe(async res => {
            this.redirect(res);
          }));
        } else if (this.mode === 'edit') {
          this.subscriptions.push(this.ideaService.updateIdea(this.idea).subscribe(res => {
            this.redirect(res);
          }));
        }
      },
      'Back'
    );
  }

  async redirect(res: boolean) {
    if (res) {
      this.alertService.showAlert(
        '👌🏻',
        'Your idea is online',
        'Okay',
        () => {
          this.router.navigate(['']);
        }
      );
    } else {
      this.alertService.showAlert(
        '(ಠ︹ಠ)',
        'Something went wrong',
        'Okay'
      );
    }

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
              const subscription5 = this.apiService.uploadImage(file).subscribe((res: any) => {
                data.insertEmbed(range.index, 'image', res.data.link);
              });
              this.subscriptions.push(subscription5);
            }
          }
        });
        input.click();
      }
    }
  }

  updateSubmitButtonState() {
    let show = false;
    if (this.idea.title && this.idea.body.changingThisBreaksApplicationSecurity) {
      if (this.mode === 'edit') {
        if (this.postHash !== hash(this.idea)) {
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
