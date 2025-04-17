// core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../authentication/services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.tokenService.getToken();

    if (token) {
      // Skip adding the token for specific routes if needed
      // For example, refreshing tokens or public endpoints
      if (this.isPublicEndpoint(request.url)) {
        return next.handle(request);
      }

      // Clone the request and add the authorization header
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next.handle(authRequest);
    }

    return next.handle(request);
  }

  private isPublicEndpoint(url: string): boolean {
    const publicEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password',
      '/api/public',
    ];

    return publicEndpoints.some((endpoint) => url.includes(endpoint));
  }
}
