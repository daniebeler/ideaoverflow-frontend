import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Idea } from 'src/app/models/idea';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { IdeaService } from 'src/app/services/idea.service';
import { UserService } from 'src/app/services/user.service';
import hash from 'object-hash';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ideaeditor',
  templateUrl: './ideaeditor.page.html',
  styleUrls: ['./ideaeditor.page.scss'],
})
export class IdeaEditorPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  user: User;
  post: Idea = new Idea([]);

  postHash = '12';

  editorInstance: any = {};

  showSubmitButton = false;

  mode = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private alertController: AlertController,
    private ideaService: IdeaService,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    const urlslice = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlslice && urlslice === 'new') {
      this.mode = 'new';
      this.post.body = this.domSanitizer.bypassSecurityTrustHtml('');
    } else if (!isNaN(+urlslice)) {
      this.mode = 'edit';
      const subscription1 = this.apiService.getIdea(+urlslice).subscribe(post => {
        this.postHash = hash(post);
        this.post = post;
      });
      this.subscriptions.push(subscription1);
    }

    const subscription2 = this.userService.getLatestUser().subscribe((latestUser) => {
      this.post.ownerId = latestUser.id;
    });
    this.subscriptions.push(subscription2);
  }

  async savePost() {
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
            const subscription3 = this.ideaService.createIdea(this.post).subscribe(async res => {
              this.redirect(res);
            });
            this.subscriptions.push(subscription3);
          } else if (this.mode === 'edit') {
            const subscription4 = this.ideaService.updateIdea(this.post).subscribe(res => {
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
    if (this.post.title && this.post.body.changingThisBreaksApplicationSecurity) {
      if (this.mode === 'edit') {
        if (this.postHash !== hash(this.post)) {
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
