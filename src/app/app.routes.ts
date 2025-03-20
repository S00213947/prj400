
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'coach',
    loadComponent: () => import('./coach/coach.page').then(m => m.CoachPage)
  },
  {
    path: 'player',
    loadComponent: () => import('./player/player.page').then(m => m.PlayerPage)
  },
  {
    path: 'signup',  
    loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage)
  },
  {
    path: '**',  
    redirectTo: 'signup',
    pathMatch: 'full'
  }
];
