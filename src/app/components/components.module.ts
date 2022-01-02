import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';

@NgModule({
  declarations: [HeaderComponent, PostsComponent],
  exports: [HeaderComponent, PostsComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ComponentsModule{}
