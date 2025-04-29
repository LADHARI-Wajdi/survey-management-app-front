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
import { UserRole } from '../authentication/models/user.model';

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
    const surveyId = route.params['id'];

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

        // Si l'utilisateur est un admin, toujours autoriser l'accès
        // Vérifier si user.roles existe et convertir la string en UserRole
        if (user.roles && user.roles.some(role => role === UserRole.ADMIN.toString() || role === UserRole.ADMIN)) {
          return new Observable<boolean>((observer) => observer.next(true));
        }

        // Vérifier si l'utilisateur a accès à cette enquête spécifique
        return this.surveyService.getSurveyById(surveyId).pipe(
          map((survey) => {
            // Vérifier si l'utilisateur a créé l'enquête
            if (survey.createdBy === user.id) {
              return true;
            }

            // Vérifier si l'utilisateur a un rôle de collaborateur pour cette enquête
            // Cela nécessiterait une logique supplémentaire avec un service réel
            // qui vérifie les autorisations de l'utilisateur pour l'enquête

            // Si non autorisé à accéder à cette enquête
            this.router.navigate(['/surveys']);
            return false;
          })
        );
      })
    );
  }
}