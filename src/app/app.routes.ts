import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { take, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { authGuard } from './auth.guard';
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  },
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then(m => m.routes),
    canActivate: [authGuard]
  },
  {
    path: 'role-select',
    loadComponent: () => import('./role-select/role-select.page').then(m => m.RoleSelectPage)
  },
  {
    path: 'coach',
    loadComponent: () => import('./coach/coach.page').then(m => m.CoachPage),
    canActivate: [() => roleGuard('coach')]
  },
  {
    path: 'player',
    loadComponent: () => import('./player/player.page').then(m => m.PlayerPage),
    canActivate: [() => roleGuard('player')]
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then(m => m.ProfilePage),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'tabs'
  }
];
