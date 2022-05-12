import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectEditorPageRoutingModule } from './projecteditor-routing.module';

import { ProjectEditorPage } from './projecteditor.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    QuillModule,
    ProjectEditorPageRoutingModule
  ],
  declarations: [ProjectEditorPage]
})
export class ProjectEditorPageModule {}
