import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { switchMap, take, filter, map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authInitialized$.pipe(
    filter(initialized => initialized === true),
    take(1),
    switchMap(() => authService.currentUser$),
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        console.log('Auth guard: No user authenticated, redirecting to login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authInitialized$.pipe(
    filter(initialized => initialized === true),
    take(1),
    switchMap(() => authService.currentUser$),
    take(1),
    map(user => {
      if (user && user.rol === 'admin') {
        return true;
      } else {
        console.log('Admin guard: User is not admin, redirecting to login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const docenteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authInitialized$.pipe(
    filter(initialized => initialized === true),
    take(1),
    switchMap(() => authService.currentUser$),
    take(1),
    map(user => {
      if (user && user.rol === 'docente') {
        return true;
      } else {
        console.log('Docente guard: User is not docente, redirecting to login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};

export const estudianteGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authInitialized$.pipe(
    filter(initialized => initialized === true),
    take(1),
    switchMap(() => authService.currentUser$),
    take(1),
    map(user => {
      if (user && user.rol === 'estudiante') {
        return true;
      } else {
        console.log('Estudiante guard: User is not estudiante, redirecting to login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
