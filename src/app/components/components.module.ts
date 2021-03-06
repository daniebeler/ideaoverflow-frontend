import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { IdeasComponent } from './ideas/ideas.component';
import { FooterComponent } from './footer/footer.component';
import { FollowersComponent } from './followers/followers.component';
import { AboutComponent } from './about/about.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { UsersComponent } from './users/users.component';
import { ProjectsComponent } from './projects/projects.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    IdeasComponent,
    ProjectsComponent,
    FollowersComponent,
    AboutComponent,
    UsersComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    IdeasComponent,
    ProjectsComponent,
    FollowersComponent,
    AboutComponent,
    UsersComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    QuillModule,
    FormsModule,
    RouterModule
  ]
})
export class ComponentsModule { }
