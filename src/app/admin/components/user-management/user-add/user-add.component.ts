// admin/components/user-management/services/user-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { environment } from '../../../../../environements/environment';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = `${environment.apiUrl}/admin/users`;

  constructor(private http: HttpClient) { }

  /**
   * Get all users
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new user
   */
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Change user role
   */
  changeUserRole(id: string, roles: string[]): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/roles`, { roles });
  }

  /**
   * Get user statistics
   */
  getUserStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  /**
   * Search users
   */
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get user activity
   */
  getUserActivity(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/activity`);
  }
}