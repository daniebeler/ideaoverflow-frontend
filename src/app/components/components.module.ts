import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { FooterComponent } from './footer/footer.component';
import { FollowersComponent } from './followers/followers.component';
import { AboutComponent } from './about/about.component';
import { EditorComponent } from './editor/editor.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, PostsComponent, FollowersComponent, AboutComponent, EditorComponent],
  exports: [HeaderComponent, FooterComponent, PostsComponent, FollowersComponent, AboutComponent, EditorComponent],
  imports: [
    IonicModule,
    CommonModule,
    QuillModule,
    FormsModule
  ]
})
export class ComponentsModule{}
