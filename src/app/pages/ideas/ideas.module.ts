import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IdeasPageRoutingModule } from './ideas-routing.module';

import { IdeasPage } from './ideas.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    IdeasPageRoutingModule
  ],
  declarations: [IdeasPage]
})
export class IdeasPageModule {}
