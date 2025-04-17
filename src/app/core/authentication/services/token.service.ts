// core/authentication/services/token.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';

  constructor() {}

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Basic validation - in a real app you might want to check expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiryDate = new Date(payload.exp * 1000);
      return expiryDate > new Date();
    } catch (e) {
      return false;
    }
  }
}
