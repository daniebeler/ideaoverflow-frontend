import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Idea } from 'src/app/models/idea';
import { ApiService } from 'src/app/services/api.service';
import { IdeaService } from 'src/app/services/idea.service';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/alert.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ideaeditor',
  templateUrl: './ideaeditor.page.html',
  styleUrls: ['./ideaeditor.page.scss'],
})
export class IdeaEditorPage implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  editorForm: FormGroup;

  idea: Idea;

  verifiedAccess = false;
  gotAccessStatus = false;

  editorInstance: any = {};

  showSubmitButton = false;

  mode: 'edit' | 'new' | 'none' = 'none';

  constructor(
    private router: Router,
    private ideaService: IdeaService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private alertService: AlertService
  ) {
    this.editorForm = new FormGroup({
      title: new FormControl<string | null>('', Validators.required),
      description: new FormControl<string | null>('', Validators.required)
    });
  }

  get title() {
    return this.editorForm.get('title');
  }

  get description() {
    return this.editorForm.get('description');
  }

  ngOnInit() {
    const urlslice = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlslice && urlslice === 'new') {
      this.mode = 'new';
      this.verifiedAccess = true;
      this.gotAccessStatus = true;
    } else if (!isNaN(+urlslice)) {
      this.mode = 'edit';
      this.subscriptions.push(this.ideaService.getIdea(+urlslice).subscribe(idea => {
        this.verifiedAccess = idea.mine;
        this.gotAccessStatus = true;
        this.idea = idea;
        this.title.setValue(this.idea.title);
        this.description.setValue(this.idea.body.changingThisBreaksApplicationSecurity);

        this.editorForm.valueChanges.subscribe(() => {
          this.updateSubmitButtonState();
        });
      }));
    }
  }

  updateSubmitButtonState() {
    let show = false;
    if (this.idea.title && this.idea.body.changingThisBreaksApplicationSecurity) {
      if (this.idea.title !== this.title.value || this.idea.body.changingThisBreaksApplicationSecurity !== this.description.value) {
        show = true;
      }
    }

    this.showSubmitButton = show;
  }

  async savePost() {
    if (this.mode === 'new') {
      this.confirmCreateIdea();
    } else {
      this.confirmUpdateIdea();
    }
  }

  confirmCreateIdea() {
    this.alertService.showAlert(
      'Are you sure?',
      'Your idea will be released',
      'Okay',
      () => {
        this.createIdea();
      },
      'Back'
    );
  }

  confirmUpdateIdea() {
    this.alertService.showAlert(
      'Are you sure?',
      'Your idea will be updated',
      'Okay',
      () => {
        this.updateIdea();
      },
      'Back'
    );
  }

  createIdea() {
    this.subscriptions.push(this.ideaService.createIdea(this.title.value, this.description.value).subscribe(res => {
      if (res.status === 'Error') {
        this.alertService.showAlert(
          'Error',
          res.error,
          'Okay'
        );
      } else {
        this.alertService.showAlert(
          'Done',
          'Your idea is now online',
          'Okay',
          () => {
            this.router.navigate(['ideas/' + res.data.id]);
          }
        );
      }
    }));
  }

  updateIdea() {
    this.subscriptions.push(this.ideaService.updateIdea(this.idea.id, this.title.value, this.description.value).subscribe(res => {
      if (res.status === 'Error') {
        this.alertService.showAlert(
          'Error',
          res.error,
          'Okay'
        );
      } else {
        this.alertService.showAlert(
          'Done',
          'Your idea has been updated',
          'Okay',
          () => {
            this.router.navigate(['ideas/' + this.idea.id]);
          }
        );
      }
    }));
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

  goBack() {
    this.router.navigate(['ideas']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
