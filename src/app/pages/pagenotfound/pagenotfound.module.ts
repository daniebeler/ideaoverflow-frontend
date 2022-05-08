import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagenotfoundPageRoutingModule } from './pagenotfound-routing.module';

import { PagenotfoundPage } from './pagenotfound.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PagenotfoundPageRoutingModule
  ],
  declarations: [PagenotfoundPage]
})
export class PagenotfoundPageModule {}
