// core/interceptors/loader.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service.ts';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loaderService: LoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Don't show loader for specific requests
    if (this.skipLoaderForUrl(request.url)) {
      return next.handle(request);
    }

    this.totalRequests++;
    this.loaderService.show();

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests === 0) {
          this.loaderService.hide();
        }
      })
    );
  }

  private skipLoaderForUrl(url: string): boolean {
    // Skip loader for APIs that should not show loading indicator
    // For example, background data polling or analytics tracking
    const skipUrls = [
      '/api/analytics/tracking',
      '/api/user/activity',
      '/api/notifications/check',
    ];

    return skipUrls.some((skipUrl) => url.includes(skipUrl));
  }
}
