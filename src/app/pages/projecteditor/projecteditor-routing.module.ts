import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProjectEditorPage } from './projecteditor.page';

const routes: Routes = [
  {
    path: '',
    component: ProjectEditorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectEditorPageRoutingModule {}
