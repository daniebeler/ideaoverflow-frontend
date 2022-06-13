import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdeaPageRoutingModule } from './idea-routing.module';

import { IdeaPage } from './idea.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IdeaPageRoutingModule
  ],
  declarations: [IdeaPage]
})
export class IdeaPageModule {}
