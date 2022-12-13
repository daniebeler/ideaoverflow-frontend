import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Idea } from 'src/app/models/idea';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { IdeaService } from 'src/app/services/idea.service';
import { UserService } from 'src/app/services/user.service';
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

  user: User;
  idea: Idea = new Idea([]);

  verifiedAccess = false;

  postHash = '12';

  editorInstance: any = {};

  showSubmitButton = false;

  mode = '';

  constructor(
    private router: Router,
    private userService: UserService,
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
      const subscription3 = this.apiService.checkIfIdeaBelongsToUser(+urlslice).subscribe(result => {
        this.verifiedAccess = result;
      });
      const subscription1 = this.apiService.getIdea(+urlslice).subscribe(post => {
        this.postHash = hash(post);
        this.idea = post;
      });
      this.subscriptions.push(subscription1, subscription3);
    }

    const subscription2 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.idea.ownerId = latestUser.id;
    });
    this.subscriptions.push(subscription2);
  }

  async savePost() {
    this.alertService.showAlert('Are you sure?',
      '',
      'Okay',
      () => {
        if (this.mode === 'new') {
          const subscription3 = this.ideaService.createIdea(this.idea).subscribe(async res => {
            this.redirect(res);
          });
          this.subscriptions.push(subscription3);
        } else if (this.mode === 'edit') {
          const subscription4 = this.ideaService.updateIdea(this.idea).subscribe(res => {
            this.redirect(res);
          });
          this.subscriptions.push(subscription4);
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
          this.router.navigate(['']);
        }
      }
    );
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
