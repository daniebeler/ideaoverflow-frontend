import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    private postService: PostService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.api.getLatestUser()
      .subscribe((latestUser) => {
        this.user = latestUser;
        console.log(this.body);
      });
  }

  gotoProfile() {
    this.router.navigate(['profile/' + this.user.username]);
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
            this.postService.updatePost(this.title, this.body, this.postId);
          }
          else {
            this.api.createPost(this.title, this.body, this.user.id);
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
              const dataFile = new FormData();
              dataFile.append('image', file);
              const headers = new HttpHeaders({ authorization: 'Client-ID c0df3b4f744766f' });
              this.http.post('https://api.imgur.com/3/image/', dataFile, { headers }).subscribe((res: any) => {
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

