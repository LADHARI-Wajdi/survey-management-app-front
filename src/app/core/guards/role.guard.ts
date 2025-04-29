// core/guards/role.guard.ts
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
        if (!user) {
          // Redirect to login page with return URL
          return this.router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
        }

        // Vérifier si l'utilisateur a au moins un des rôles requis
        const hasRequiredRole = requiredRoles.some((role) => 
          user.roles.includes(role as UserRole)
        );

        if (!hasRequiredRole) {
          // Redirect to access denied page
          return this.router.createUrlTree(['/access-denied']);
        }

        return true;
      })
    );
  }
}

// Implement as a functional guard for modern Angular
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
      if (!user) {
        // Redirect to login page with return URL
        return router.createUrlTree(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
      }

      // Vérifier si l'utilisateur a au moins un des rôles requis
      const hasRequiredRole = requiredRoles.some((role) => 
        user.roles.includes(role as UserRole)
      );

      if (!hasRequiredRole) {
        // Redirect to access denied page
        return router.createUrlTree(['/access-denied']);
      }

      return true;
    })
  );
};