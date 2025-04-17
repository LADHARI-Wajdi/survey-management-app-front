import { CanActivateFn } from '@angular/router';

export const surveyAccessGuard: CanActivateFn = (route, state) => {
  return true;
};
// core/guards/survey-access.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../authentication/services/auth.service';
import { SurveyService } from '../../features/survey-management/services/survey.service';

@Injectable({
  providedIn: 'root',
})
export class SurveyAccessGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private surveyService: SurveyService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const surveyId = route.params.id;

    if (!surveyId) {
      this.router.navigate(['/surveys']);
      return new Observable<boolean>((observer) => observer.next(false));
    }

    return this.authService.currentUser$.pipe(
      take(1),
      switchMap((user) => {
        if (!user) {
          this.router.navigate(['/auth/login']);
          return new Observable<boolean>((observer) => observer.next(false));
        }

        // If the user is an admin, always grant access
        if (user.roles.includes('admin')) {
          return new Observable<boolean>((observer) => observer.next(true));
        }

        // Check if the user has access to this specific survey
        return this.surveyService.getSurveyById(surveyId).pipe(
          map((survey) => {
            // Check if the user created the survey
            if (survey.createdBy === user.id) {
              return true;
            }

            // Check if user has collaborator role for this survey
            // This would require additional logic with a real service
            // that checks user permissions for the survey

            // If not authorized to access this survey
            this.router.navigate(['/surveys']);
            return false;
          })
        );
      })
    );
  }
}
