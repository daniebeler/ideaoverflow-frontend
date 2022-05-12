import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Post } from 'src/app/models/post';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/services/api.service';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';
import hash from 'object-hash';

@Component({
  selector: 'app-posteditor',
  templateUrl: './posteditor.page.html',
  styleUrls: ['./posteditor.page.scss'],
})
export class PostEditorPage implements OnInit {

  user: User;
  post: Post = new Post([]);

  postHash = '12';

  editorInstance: any = {};

  showSubmitButton = false;

  mode = '';

  constructor(
    private router: Router,
    private userService: UserService,
    private alertController: AlertController,
    private postService: PostService,
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
      this.apiService.getPost(+urlslice).subscribe(post => {
        this.postHash = hash(post);
        this.post = post;
      });
    }

    this.userService.getLatestUser().subscribe((latestUser) => {
      this.post.ownerId = latestUser.id;
    });
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
            this.postService.createPost(this.post).subscribe(async res => {
              this.redirect(res);
            });
          } else if (this.mode === 'edit') {
            this.postService.updatePost(this.post).subscribe(res => {
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
}
