// core/authentication/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>('/api/auth/login', credentials).pipe(
      tap((response) => {
        this.tokenService.setToken(response.accessToken);
        this.loadCurrentUser();
      })
    );
  }

  register(user: any): Observable<any> {
    return this.http.post<any>('/api/auth/register', user);
  }

  logout(): void {
    this.tokenService.removeToken();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>('/api/auth/forgot-password', { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>('/api/auth/reset-password', {
      token,
      newPassword,
    });
  }

  private loadCurrentUser(): void {
    const token = this.tokenService.getToken();
    if (token) {
      this.http.get<User>('/api/auth/me').subscribe(
        (user) => this.currentUserSubject.next(user),
        (error) => {
          this.tokenService.removeToken();
          this.currentUserSubject.next(null);
        }
      );
    }
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user ? user.roles.includes(role) : false;
  }
}
