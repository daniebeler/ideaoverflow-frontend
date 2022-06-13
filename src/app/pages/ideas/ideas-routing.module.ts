import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IdeasPage } from './ideas.page';

const routes: Routes = [
  {
    path: '',
    component: IdeasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdeasPageRoutingModule {}
