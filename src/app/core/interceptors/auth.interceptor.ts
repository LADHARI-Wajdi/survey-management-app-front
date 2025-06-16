import { Injectable, Injector } from '@angular/core'; // 👈 ajoute Injector
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
// ⚠️ SUPPRIME l'import direct de AuthService ici
// import { AuthService } from '../authentication/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private tokenService: TokenService, private injector: Injector) {} // 👈 remplace AuthService par Injector

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    console.log('Adding auth token to request');
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log(`Intercepting request to: ${request.url}`);

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

      // 👇 récupère AuthService via Injector (au lieu de via constructor)
      const authService = this.injector.get(AuthService);
      authService.logout();
      

      return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));

      /* Implémentation future pour le rafraîchissement des tokens
      return authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.addTokenToRequest(request, token.accessToken));
        }),
        catchError((err) => {
          this.isRefreshing = false;
          authService.logout();
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

  isPublicEndpoint(url: string): boolean {
    const isPublic = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/forgot-password');
    console.log(`isPublicEndpoint for ${url}: ${isPublic}`);
    return isPublic;
  }
}
