import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, PostsComponent],
  exports: [HeaderComponent, FooterComponent, PostsComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ComponentsModule{}
