import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdeaEditorPage as IdeaEditorPage } from './ideaeditor.page';

const routes: Routes = [
  {
    path: '',
    component: IdeaEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdeaEditorPageRoutingModule {}
