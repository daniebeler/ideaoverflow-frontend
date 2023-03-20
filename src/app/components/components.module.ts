import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { IdeasComponent } from './ideas/ideas.component';
import { FooterComponent } from './footer/footer.component';
import { FollowersComponent } from './followers/followers.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersComponent } from './users/users.component';
import { ProjectsComponent } from './projects/projects.component';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IdeaComponent } from './idea/idea.component';
import { CommentsComponent } from './comments/comments.component';
import { TimeAgoPipe } from '../pipes/time-ago.pipe';
import { UserBadgeComponent } from './user-badge/user-badge.component';

@NgModule({
  declarations: [
    FooterComponent,
    IdeasComponent,
    ProjectsComponent,
    FollowersComponent,
    IdeaComponent,
    SidebarComponent,
    UsersComponent,
    CommentsComponent,
    TimeAgoPipe,
    UserBadgeComponent
  ],
  exports: [
    FooterComponent,
    IdeasComponent,
    ProjectsComponent,
    FollowersComponent,
    IdeaComponent,
    SidebarComponent,
    UsersComponent,
    CommentsComponent,
    UserBadgeComponent,
    NgOptimizedImage,
    ReactiveFormsModule
  ],
  imports: [
    IonicModule,
    CommonModule,
    QuillModule,
    FormsModule,
    RouterModule,
    NgOptimizedImage,
    ReactiveFormsModule
  ]
})
export class ComponentsModule { }
