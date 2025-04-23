import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { roleGuard } from '../role.guard';


export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () => import('../tab1/tab1.page').then(m => m.Tab1Page),
      },
      {
        path: 'Coach',
        loadComponent: () =>
          import('../coach/coach.page').then((m) => m.CoachPage),
        canActivate: [() => roleGuard('coach')],
      },
      {
        path: 'player',
        loadComponent: () =>
          import('../player/player.page').then((m) => m.PlayerPage),
        canActivate: [() => roleGuard('player')],
      },
      {
        path: 'teams',
        children: [
          {
            path: '',
            loadComponent: () => import('./teams/teams.page').then(m => m.TeamsPage),
          },
          {
            path: ':id',
            loadComponent: () => import('./teams/team-detail/team-detail.page').then(m => m.TeamDetailPage),
          }
        ]
      },
      {
        path: 'profile',
        loadComponent: () => import('../profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full'
      }
    ]
  }
];
