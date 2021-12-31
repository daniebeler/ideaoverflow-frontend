import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AutoLoginGuard } from './guards/auto-login.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterPageModule),
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule),
    canActivate: [AutoLoginGuard]
  },
  {
    path: 'profile/:username',
    loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'verify/:code',
    loadChildren: () => import('./pages/verify/verify.module').then(m => m.VerifyPageModule)
  },
  {
    path: 'followers',
    loadChildren: () => import('./modals/followers/followers.module').then(m => m.FollowersPageModule)
  },
  {
    path: 'newpost',
    loadChildren: () => import('./pages/newpost/newpost.module').then(m => m.NewpostPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadChildren: () => import('./pages/pagenotfound/pagenotfound.module').then( m => m.PagenotfoundPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
