// core/authentication/services/auth.service.ts
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, UserRole } from '../../models/user.model';
import { TokenService } from './token.service';
import { environements } from '../../../../environements/environement';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environements.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadCurrentUser();
    }
  }

login(credentials: { username: string; password: string }): Observable<any> {
  console.log('[DEBUG] Login attempt with username:', credentials.username);
  return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
    tap(response => {
      console.log('[DEBUG] Login response:', response);
      if (response && response.access_token) {
        this.tokenService.setToken(response.access_token);
        
        // Create user object directly from response
        if (response.user) {
          // Fix role case-sensitivity issues
          let userRoles: UserRole[] = [];
          
          if (response.user.role) {
            // Handle "INVESTIGATOR" vs "investigator" case-sensitivity
            const roleLower = typeof response.user.role === 'string' 
              ? response.user.role.toLowerCase() 
              : '';
            
            console.log('[DEBUG] Role from API (lowercase):', roleLower);
            
            if (roleLower === 'admin') {
              userRoles = [UserRole.ADMIN];
            } else if (roleLower === 'investigator') {
              userRoles = [UserRole.INVESTIGATOR];
            } else if (roleLower === 'participant') {
              userRoles = [UserRole.PARTICIPANT];
            } else {
              console.warn(`[DEBUG] Unknown role: ${response.user.role}, defaulting to PARTICIPANT`);
              userRoles = [UserRole.PARTICIPANT];
            }
          } else {
            console.warn('[DEBUG] No role in user response, defaulting to PARTICIPANT');
            userRoles = [UserRole.PARTICIPANT];
          }
          
          console.log('[DEBUG] User roles after mapping:', userRoles);
          
          const user: User = {
            id: response.user.id,
            username: response.user.username,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            roles: userRoles,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          console.log('[DEBUG] Setting user in currentUserSubject:', user);
          this.currentUserSubject.next(user);
        } else {
          this.loadCurrentUser();
        }
      }
    }),
    catchError(this.handleError)
  );
}

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    console.log('[AuthService] Logging out user');
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { token, password: newPassword }).pipe(
      catchError(this.handleError)
    );
  }

private loadCurrentUser(): void {
  const token = this.tokenService.getToken();
  if (!token) {
    console.log('[DEBUG] No token found');
    return;
  }

  const decoded = this.tokenService.getTokenPayload();
  if (!decoded) {
    console.warn('[DEBUG] Token decoding failed, removing token');
    this.tokenService.removeToken();
    return;
  }

  const role = typeof decoded.role === 'string'
    ? decoded.role.toLowerCase()
    : 'participant';

  const user: User = {
    id: decoded.sub ?? decoded.id,
    username: decoded.username,
    email: decoded.email,
    firstName: decoded.firstName,
    lastName: decoded.lastName,
    roles: [role as UserRole],
    createdAt: new Date(decoded.iat * 1000),
    updatedAt: new Date(decoded.exp * 1000)
  };

  console.log('[DEBUG] Rehydrated user from token:', user);
  this.currentUserSubject.next(user);
}

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole | string): boolean {
    const user = this.currentUserValue;
    const hasRole = !!user?.roles?.includes(role as UserRole);
    return hasRole;
  }

  redirectByRole(defaultRedirect: string = '/'): void {
    const user = this.currentUserValue;

    if (!user || !user.roles?.length) {
      console.warn('[AuthService] No user or roles. Redirecting to login.');
      this.router.navigate(['/auth/login']);
      return;
    }

    const destination = this.getRedirectPathByRole(user.roles);
    console.log('[Adam] Redirecting to:', destination || defaultRedirect);
    this.router.navigate([destination || defaultRedirect]);
  }

private getRedirectPathByRole(roles: UserRole[]): string {
  console.log('[DEBUG] Redirection selon roles:', roles);
  console.log('[DEBUG] Comparer avec:', UserRole.ADMIN, UserRole.INVESTIGATOR, UserRole.PARTICIPANT);

  // Convert roles to lowercase strings for comparison
  const lowerCaseRoles = roles.map(role => String(role).toLowerCase());
  console.log('[DEBUG] Lowercase roles:', lowerCaseRoles);
  if (lowerCaseRoles.includes(UserRole.ADMIN.toLowerCase())) {
    console.log('[DEBUG] Redirection vers /admin');
    return '/admin';
  }

  if (lowerCaseRoles.includes(UserRole.INVESTIGATOR.toLowerCase())) {
    console.log('[DEBUG] Redirection vers /investigator/dashboard');
    return '/investigator/dashboard';
  }

  if (lowerCaseRoles.includes(UserRole.PARTICIPANT.toLowerCase())) {
    console.log('[DEBUG] Redirection vers /participant/dashboard');
    return '/participant/dashboard';
  }

  return '/';
}

  private handleError(error: HttpErrorResponse) {
    const isClientError = error.error instanceof ErrorEvent;
    const message = isClientError
      ? `Client Error: ${error.error.message}`
      : error.error?.message || `Server Error: Code ${error.status}, ${error.message}`;

    console.error('[AuthService] HTTP Error:', message);
    return throwError(() => ({ error: error.error, message }));
  }
}