// core/guards/auth.guard.ts
import { inject, Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      // Redirect to login page with return URL
      return this.router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    return this.authService.currentUser$.pipe(
      take(1),
      map((user) => {
        if (user) {
          return true;
        } else {
          // Redirect to login page with return URL
          return this.router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url }
          });
        }
      })
    );
  }
}

// Implement as a functional guard for modern Angular
export const authGuard = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = localStorage.getItem('auth_token');

  if (!token) {
    // Redirect to login page with return URL
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
  }

  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        // Redirect to login page with return URL
        return router.createUrlTree(['/auth/login'], {
          queryParams: { returnUrl: state.url }
        });
      }
    })
  );
};