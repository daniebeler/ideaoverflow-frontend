import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewprojectPageRoutingModule } from './newproject-routing.module';

import { NewprojectPage } from './newproject.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    QuillModule,
    NewprojectPageRoutingModule
  ],
  declarations: [NewprojectPage]
})
export class NewprojectPageModule {}
