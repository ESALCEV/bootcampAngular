import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserRole } from '../../users/models/user.model';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser  = authService.currentUser();

  if (currentUser && currentUser.roles?.includes(UserRole.ADMIN)) {
    return true;
  }
  return router.parseUrl('/tasks');
};