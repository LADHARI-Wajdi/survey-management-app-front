// core/authentication/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, UserRole } from '../../models/user.model';
import { TokenService } from './token.service';
import { environements } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Utiliser l'URL de l'API depuis le fichier d'environnement
  private apiUrl = `${environements.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    console.log('Attempting login with:', credentials.email);
    // Utiliser l'URL complète basée sur l'environnement
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        console.log('Login response:', response);
        if (response && response.accessToken) {
          this.tokenService.setToken(response.accessToken);
          // Charger les informations de l'utilisateur après l'authentification
          this.loadCurrentUser();
        } else {
          console.error('No access token in response:', response);
        }
      }),
      catchError(this.handleError)
    );
  }

  registerform(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  logout(): void {
    console.log('Logging out user');
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email }).pipe(
      catchError(this.handleError)
    );
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, {
      token,
      password: newPassword,
    }).pipe(
      catchError(this.handleError)
    );
  }

  private loadCurrentUser(): void {
    const token = this.tokenService.getToken();
    console.log('Loading current user, token exists:', !!token);
    
    if (token) {
      this.http.get<User>(`${this.apiUrl}/me`).pipe(
        catchError((error) => {
          console.error('Error loading user:', error);
          this.tokenService.removeToken();
          return of(null);
        })
      ).subscribe({
        next: (user) => {
          if (user) {
            console.log('User loaded successfully:', user);
            this.currentUserSubject.next(user);
          } else {
            this.currentUserSubject.next(null);
          }
        }
      });
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: UserRole | string): boolean {
    const user = this.currentUserValue;
    if (!user || !user.roles) {
      console.log('No user or no roles defined');
      return false;
    }
    
    // Vérifier si l'utilisateur a le rôle spécifié
    const hasRole = user.roles.includes(role as UserRole);
    console.log(`Checking role ${role} for user:`, hasRole);
    return hasRole;
  }

  // Implémentation de la méthode redirectByRole
  redirectByRole(returnUrl: string = '/'): void {
    const user = this.currentUserValue;
    if (!user || !user.roles || user.roles.length === 0) {
      console.error('User or roles not available for redirection');
      this.router.navigate(['/auth/login']);
      return;
    }

    // Rediriger en fonction du premier rôle de l'utilisateur
    // Priorité: ADMIN > INVESTIGATOR > PARTICIPANT
    if (user.roles.includes(UserRole.ADMIN)) {
      this.router.navigate(['/admin/dashboard']);
    } else if (user.roles.includes(UserRole.INVESTIGATOR)) {
      this.router.navigate(['/investigator/dashboard']);
    } else if (user.roles.includes(UserRole.PARTICIPANT)) {
      this.router.navigate(['/participant/dashboard']);
    } else {
      // Si aucun rôle reconnu, rediriger vers le returnUrl ou la page d'accueil
      this.router.navigate([returnUrl || '/']);
    }
  }

  // Gestionnaire d'erreurs génériques pour les requêtes HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('Auth service error:', error);
    let errorMessage = 'Une erreur est survenue lors de la communication avec le serveur.';
    
    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = error.error?.message || `Code: ${error.status}, Message: ${error.message}`;
    }
    
    return throwError(() => ({ error: error.error, message: errorMessage }));
  }
}