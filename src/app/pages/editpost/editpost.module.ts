import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditpostPageRoutingModule } from './editpost-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';

import { EditpostPage } from './editpost.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    EditpostPageRoutingModule
  ],
  declarations: [EditpostPage]
})
export class EditpostPageModule {}
