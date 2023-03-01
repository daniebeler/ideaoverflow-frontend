import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AutoLoginGuard } from 'src/app/guards/auto-login.guard';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'users/:username',
        loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule),
        title: 'Users • Idea Overflow'
      },
      {
        path: 'users',
        loadChildren: () => import('../profiles/profiles.module').then(m => m.ProfilesPageModule),
        title: 'Users • Idea Overflow'
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsPageModule),
        title: 'Settings • Idea Overflow',
        canActivate: [AuthGuard]
      },
      {
        path: 'verify/:code',
        loadChildren: () => import('../verify/verify.module').then(m => m.VerifyPageModule),
        title: 'Verify • Idea Overflow'
      },
      {
        path: 'ideaeditor/:id',
        loadChildren: () => import('../ideaeditor/ideaeditor.module').then(m => m.IdeaEditorPageModule),
        title: 'Ideaeditor • Idea Overflow',
        canActivate: [AuthGuard]
      },
      {
        path: 'search/:search',
        loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule),
        title: 'Search • Idea Overflow'
      },
      {
        path: 'about',
        loadChildren: () => import('../about/about.module').then(m => m.AboutPageModule),
        title: 'About • Idea Overflow'
      },
      {
        path: 'privacy',
        loadChildren: () => import('../privacy/privacy.module').then(m => m.PrivacyPageModule),
        title: 'Privacy • Idea Overflow'
      },
      {
        path: 'resetpassword',
        loadChildren: () => import('../resetpassword/resetpassword.module').then(m => m.ResetpasswordPageModule),
        title: 'Reset Password• Idea Overflow'
      },
      {
        path: 'resetpassword/:code',
        loadChildren: () => import('../setnewpassword/setnewpassword.module').then(m => m.SetnewpasswordPageModule),
        title: 'Reset Password• Idea Overflow'
      },
      {
        path: 'ideas',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
        title: 'Home • Idea Overflow'
      },
      {
        path: 'projects/:id',
        loadChildren: () => import('../project/project.module').then(m => m.ProjectPageModule),
        title: 'Projects • Idea Overflow'
      },
      {
        path: 'projects',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
        title: 'Projects • Idea Overflow'
      },
      {
        path: 'projecteditor/:id',
        loadChildren: () => import('../projecteditor/projecteditor.module').then(m => m.ProjectEditorPageModule),
        title: 'Projecteditor• Idea Overflow',
        canActivate: [AuthGuard]
      },
      {
        path: 'ideas/:id',
        loadChildren: () => import('../idea/idea.module').then(m => m.IdeaPageModule),
        title: 'Ideas • Idea Overflow'
      },
      {
        path: 'register',
        loadChildren: () => import('../register/register.module').then(m => m.RegisterPageModule),
        title: 'Register • Idea Overflow',
        canActivate: [AutoLoginGuard]
      },
      {
        path: 'login',
        loadChildren: () => import('../login/login.module').then(m => m.LoginPageModule),
        title: 'Login • Idea Overflow',
        canActivate: [AutoLoginGuard]
      },
      {
        path: 'error',
        loadChildren: () => import('../error/error.module').then(m => m.ErrorPageModule),
        title: 'Error • Idea Overflow'
      },
      {
        path: '**',
        redirectTo: 'ideas',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
