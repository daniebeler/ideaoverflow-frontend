import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewprojectPage } from './newproject.page';

const routes: Routes = [
  {
    path: '',
    component: NewprojectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewprojectPageRoutingModule {}
