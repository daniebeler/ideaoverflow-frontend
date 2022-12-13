import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdeaPage } from './idea.page';

const routes: Routes = [
  {
    path: '',
    component: IdeaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdeaPageRoutingModule {}
