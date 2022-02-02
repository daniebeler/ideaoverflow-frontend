import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SetnewpasswordPageRoutingModule } from './setnewpassword-routing.module';

import { SetnewpasswordPage } from './setnewpassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SetnewpasswordPageRoutingModule
  ],
  declarations: [SetnewpasswordPage]
})
export class SetnewpasswordPageModule {}
