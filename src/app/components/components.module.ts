import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ComponentsModule{}
