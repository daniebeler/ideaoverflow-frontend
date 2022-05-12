import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostEditorPage as PostEditorPage } from './posteditor.page';

const routes: Routes = [
  {
    path: '',
    component: PostEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostEditorPageRoutingModule {}
