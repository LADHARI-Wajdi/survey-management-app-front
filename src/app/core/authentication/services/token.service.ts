// core/authentication/services/token.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  setToken(token: string): void {
    if (!token) {
      console.warn('Attempting to set an empty token');
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      console.log('Setting auth token');
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  removeToken(): void {
    console.log("removed")
    if (isPlatformBrowser(this.platformId)) {
      console.log('Removing auth token');
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  setRefreshToken(token: string): void {
    if (isPlatformBrowser(this.platformId) && token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryDate = new Date(payload.exp * 1000);
      const isValid = expiryDate > new Date();
      console.log('Token validity check:', isValid, 'Expires:', expiryDate);
      return isValid;
    } catch (e) {
      console.error('Error validating token:', e);
      return false;
    }
  }

  getTokenPayload(): any {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error decoding token payload:', e);
      return null;
    }
  }
}