 import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { tap, take, map } from 'rxjs/operators';

export const roleGuard = (expectedRole: 'player' | 'coach') => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.user$.pipe(
    take(1),
    tap(user => {
      const role = localStorage.getItem('userRole');
      console.log('[roleGuard] Expected:', expectedRole, '| Actual:', role);

      if (!user) {
        console.warn('[roleGuard] No user, redirecting to login.');
        auth.loginWithRedirect();
        return;
      }

      if (role !== expectedRole) {
        console.warn('[roleGuard] Role mismatch, redirecting to role-select.');
        router.navigate(['/role-select']);
      }
    }),
    map(user => {
      const role = localStorage.getItem('userRole');
      return user && role === expectedRole;
    })
  );
}; 

