// core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { TokenService } from '../authentication/services/token.service';
import { AuthService } from '../authentication/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenService, private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log(`Intercepting request to: ${request.url}`);

    // Ajouter des logs pour le debugging
    if (!this.isPublicEndpoint(request.url)) {
      const token = this.tokenService.getToken();
      console.log(`Token exists: ${!!token}`);
      if (token) {
        request = this.addTokenToRequest(request, token);
      }
    } else {
      console.log(`Skipping token for public endpoint: ${request.url}`);
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(`Error intercepted: ${error.status}`);
        
        if (error.status === 401) {
          // Token expiré ou invalide
          console.log('401 Unauthorized error detected');
          return this.handle401Error(request, next);
        }
        
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Forcer la déconnexion ici pour l'instant au lieu d'essayer de rafraîchir le token
      this.authService.logout();
      return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));

      /* Implémentation future pour le rafraîchissement des tokens
      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addTokenToRequest(request, token.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => err);
        })
      );
      */
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addTokenToRequest(request, jwt));
        })
      );
    }
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    console.log('Adding auth token to request');
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/public'
    ];

    return publicEndpoints.some(endpoint => url.includes(endpoint));
  }
}