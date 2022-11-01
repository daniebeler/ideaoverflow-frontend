import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetnewpasswordPageRoutingModule } from './setnewpassword-routing.module';

import { SetnewpasswordPage } from './setnewpassword.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    SetnewpasswordPageRoutingModule
  ],
  declarations: [SetnewpasswordPage]
})
export class SetnewpasswordPageModule {}
