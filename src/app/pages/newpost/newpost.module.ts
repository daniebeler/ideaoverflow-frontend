import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewpostPageRoutingModule } from './newpost-routing.module';

import { NewpostPage } from './newpost.page';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewpostPageRoutingModule,
    QuillModule
  ],
  declarations: [NewpostPage]
})
export class NewpostPageModule {}
