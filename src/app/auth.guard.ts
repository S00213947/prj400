 import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CanActivateFn } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';



export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);

  return combineLatest([auth.isLoading$, auth.user$]).pipe(
    take(1),
    tap(([loading, user]) => {

      const role = localStorage.getItem('userRole');
      
      console.log('[auth.guard] Role in localStorage:', role);
      if (!loading && !user) {
        console.log('[auth.guard] Not authenticated – redirecting to Auth0');
        auth.loginWithRedirect();
      }
    }),
    map(([loading, user]) => {
      return !loading && !!user;
    })
  );
};

 
/* 
import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  console.warn('[auth.guard] BYPASSED – Auth disabled for local testing');
  return true;
};
 */