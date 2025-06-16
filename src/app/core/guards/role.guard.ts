import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../authentication/services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * Guard that checks if the user has the required roles to access a route
 */
@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return this.authService.currentUser$.pipe(
      take(1),
      map((user) => {
        // If no user is authenticated, redirect to login
        if (!user) {
          return this.router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
        }

        // Check if user has any of the required roles
        
  

const hasRequiredRole = requiredRoles.some((requiredRole) => {
  const match = user.roles.some(userRole => {
    const isMatch = String(userRole).toLowerCase() === requiredRole.toLowerCase();
    return isMatch;
  });
  return match;
});

  

        // Redirect to access denied if user lacks required roles
        if (!hasRequiredRole) {
          return this.router.createUrlTree(['/access-denied']);
        }

        return true;
      })
    );
  }
}

/**
 * Functional version of the role guard for use with standalone components
 */
export const roleGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      // If no user is authenticated, redirect to login
      if (!user) {
        return router.createUrlTree(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
      console.log('requiredRoles:', requiredRoles);
      // Check if user has any of the required roles
      const hasRequiredRole = requiredRoles.some((requiredRole) => 
        user.roles.some(userRole => 
          String(userRole).toLowerCase() === requiredRole.toLowerCase()
        )
      );
      console.log('User Roles:', user.roles);
      console.log('has RequiredRole:', hasRequiredRole);
      // Redirect to access denied if user lacks required roles
      if (!hasRequiredRole) {
        return router.createUrlTree(['/access-denied']);
      }

      return true;
    })
  );
};