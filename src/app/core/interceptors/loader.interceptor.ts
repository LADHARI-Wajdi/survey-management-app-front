import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service'; // Retirez l'extension .ts

// On a besoin de garder le compteur de requêtes entre les appels
let totalRequests = 0;

export const loaderInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const loaderService = inject(LoaderService);

  // Don't show loader for specific requests
  if (skipLoaderForUrl(request.url)) {
    return next(request);
  }

  totalRequests++;
  loaderService.show();

  return next(request).pipe(
    finalize(() => {
      totalRequests--;
      if (totalRequests === 0) {
        loaderService.hide();
      }
    })
  );
};

function skipLoaderForUrl(url: string): boolean {
  // Skip loader for APIs that should not show loading indicator
  // For example, background data polling or analytics tracking
  const skipUrls = [
    '/api/analytics/tracking',
    '/api/user/activity',
    '/api/notifications/check',
  ];

  return skipUrls.some((skipUrl) => url.includes(skipUrl));
}
