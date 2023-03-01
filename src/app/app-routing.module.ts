import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule),
    title: 'Register • Idea Overflow',
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    title: 'Login • Idea Overflow',
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'users/:username',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule),
    title: 'Users • Idea Overflow'
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/profiles/profiles.module').then(m => m.ProfilesPageModule),
    title: 'Users • Idea Overflow'
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
    title: 'Settings • Idea Overflow',
    canActivate: [AuthGuard]
  },
  {
    path: 'verify/:code',
    loadChildren: () => import('./pages/verify/verify.module').then(m => m.VerifyPageModule),
    title: 'Verify • Idea Overflow'
  },
  {
    path: 'ideaeditor/:id',
    loadChildren: () => import('./pages/ideaeditor/ideaeditor.module').then(m => m.IdeaEditorPageModule),
    title: 'Ideaeditor • Idea Overflow',
    canActivate: [AuthGuard]
  },
  {
    path: 'search/:search',
    loadChildren: () => import('./pages/search/search.module').then(m => m.SearchPageModule),
    title: 'Search • Idea Overflow'
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule),
    title: 'About • Idea Overflow'
  },
  {
    path: 'privacy',
    loadChildren: () => import('./pages/privacy/privacy.module').then(m => m.PrivacyPageModule),
    title: 'Privacy • Idea Overflow'
  },
  {
    path: 'resetpassword',
    loadChildren: () => import('./pages/resetpassword/resetpassword.module').then(m => m.ResetpasswordPageModule),
    title: 'Reset Password• Idea Overflow'
  },
  {
    path: 'resetpassword/:code',
    loadChildren: () => import('./pages/setnewpassword/setnewpassword.module').then(m => m.SetnewpasswordPageModule),
    title: 'Reset Password• Idea Overflow'
  },
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    title: 'Home • Idea Overflow'
  },
  {
    path: 'projects/:id',
    loadChildren: () => import('./pages/project/project.module').then(m => m.ProjectPageModule),
    title: 'Projects • Idea Overflow'
  },
  {
    path: 'projects',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
    title: 'Projects • Idea Overflow'
  },
  {
    path: 'projecteditor/:id',
    loadChildren: () => import('./pages/projecteditor/projecteditor.module').then(m => m.ProjectEditorPageModule),
    title: 'Projecteditor• Idea Overflow',
    canActivate: [AuthGuard]
  },
  {
    path: 'ideas/:id',
    loadChildren: () => import('./pages/idea/idea.module').then(m => m.IdeaPageModule),
    title: 'Ideas • Idea Overflow'
  },
  {
    path: 'ideas',
    redirectTo: '/'
  },
  {
    path: 'error',
    loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorPageModule),
    title: 'Error • Idea Overflow'
  },
  {
    path: '**',
    loadChildren: () => import('./pages/pagenotfound/pagenotfound.module').then(m => m.PagenotfoundPageModule),
    title: '404 • Idea Overflow'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
