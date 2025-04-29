import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, catchError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if ([401, 403].includes(error.status)) {
        // Auto logout if 401 or 403 response returned from API
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/auth/login']);
        } else if (error.status === 403) {
          router.navigate(['/access-denied']);
        }
      }

      // Server error
      if (error.status === 500) {
        router.navigate(['/server-error']);
      }

      // Format the error message
      const errorMessage = getErrorMessage(error);

      // Return the error to the component
      return throwError(() => errorMessage);
    })
  );
};

function getErrorMessage(error: HttpErrorResponse): any {
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
