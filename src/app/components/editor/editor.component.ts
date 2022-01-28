import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {

  @Input() title = '';
  @Input() body: any;
  @Input() buttonText = 'Release Post';
  @Input() postId: number;

  user: User;

  editorInstance: any = {};

  constructor(
    private router: Router,
    private api: ApiService,
    private alertController: AlertController,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.api.getLatestUser()
      .subscribe((latestUser) => {
        this.user = latestUser;
      });
  }

  gotoProfile() {
    this.router.navigate(['users/' + this.user.username]);
  }

  gotoHome() {
    this.router.navigate(['']);
  }

  async savePost() {
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
          if (this.postId) {
            this.postService.updatePost(this.title, this.body, this.postId).subscribe(async res => {
              this.redirect(res);
            });
          }
          else {
            this.postService.createPost(this.title, this.body, this.user.id).subscribe(async res => {
              this.redirect(res);
            });
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
              this.api.uploadImage(file).subscribe((res: any) => {
                data.insertEmbed(range.index, 'image', res.data.link);
              });
            }
          }
        });
        input.click();
      }
    }
  }
}

