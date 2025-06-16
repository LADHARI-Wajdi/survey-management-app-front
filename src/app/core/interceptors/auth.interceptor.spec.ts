import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../authentication/services/auth.service';
import { TokenService } from '../authentication/services/token.service';
import { LoggerService } from '../services/logger.service';
import { authInterceptor } from './auth.interceptor';


describe('authInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => {
      const authService = TestBed.inject(AuthService);
      const tokenService = TestBed.inject(TokenService);
      const logger = TestBed.inject(LoggerService);
      return interceptor.intercept(req, next); // Call the intercept method of the AuthInterceptor instance
    });

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
