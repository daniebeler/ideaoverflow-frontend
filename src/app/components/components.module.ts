import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PostsComponent } from './posts/posts.component';
import { FooterComponent } from './footer/footer.component';
import { FollowersComponent } from './followers/followers.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, PostsComponent, FollowersComponent, AboutComponent],
  exports: [HeaderComponent, FooterComponent, PostsComponent, FollowersComponent, AboutComponent],
  imports: [
    IonicModule,
    CommonModule
  ]
})
export class ComponentsModule{}
