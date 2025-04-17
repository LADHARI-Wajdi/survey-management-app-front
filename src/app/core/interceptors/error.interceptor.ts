// core/interceptors/error.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if ([401, 403].includes(error.status)) {
          // Auto logout if 401 or 403 response returned from API
          if (error.status === 401) {
            this.authService.logout();
            this.router.navigate(['/auth/login']);
          } else if (error.status === 403) {
            this.router.navigate(['/access-denied']);
          }
        }

        // Server error
        if (error.status === 500) {
          this.router.navigate(['/server-error']);
        }

        // Format the error message
        const errorMessage = this.getErrorMessage(error);

        // Return the error to the component
        return throwError(errorMessage);
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return {
        message: error.error.message,
        status: error.status,
      };
    } else {
      // Server-side error
      return {
        message:
          error.error?.message ||
          'Une erreur est survenue. Veuillez réessayer plus tard.',
        status: error.status,
        errors: error.error?.errors || null,
      };
    }
  }
}
