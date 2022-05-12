import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PostEditorPageRoutingModule } from './posteditor-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { PostEditorPage } from './posteditor.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    QuillModule,
    PostEditorPageRoutingModule
  ],
  declarations: [PostEditorPage]
})
export class PostEditorPageModule {}
