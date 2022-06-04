import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdeaEditorPageRoutingModule } from './ideaeditor-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { IdeaEditorPage } from './ideaeditor.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    QuillModule,
    IdeaEditorPageRoutingModule
  ],
  declarations: [IdeaEditorPage]
})
export class IdeaEditorPageModule {}
