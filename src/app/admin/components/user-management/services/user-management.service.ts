// admin/components/user-management/services/user-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { environements } from '../../../../../environements/environement';
import { map } from 'rxjs/operators';
import { UserRole } from '../../../../core/models/user.model'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private apiUrl = `${environements.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  /**
   * Get all users
   */
  getAllUsers(): Observable<User[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      map(users =>
        users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
          roles: [user.role.toLowerCase()] as UserRole[],
          // Optional fields if needed:
          firstName: user.firstName ?? '',
          lastName: user.lastName ?? '',
          profilePicture: user.profilePicture ?? '',
        }))
      )
    );
  }

  /**
   * Get user by ID
   */
  getUserById(id: string): Observable<User> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Create a new user
   */
  createUser(user: Partial<User>): Observable<User> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<User>(this.apiUrl, user, { headers });
  }

  /**
   * Update an existing user
   */
  updateUser(id: string, userData: Partial<User>): Observable<User> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData, { headers });
  }

  /**
   * Delete a user
   */
  deleteUser(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  /**
   * Change user role
   */
  changeUserRole(id: string, roles: string[]): Observable<User> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.patch<User>(`${this.apiUrl}/${id}/roles`, { roles }, { headers });
  }

  /**
   * Get user statistics
   */
  getUserStats(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/stats`, { headers });
  }

  /**
   * Get users by role
   */
  getUsersByRole(role: string): Observable<User[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`, { headers });
  }

  /**
   * Search users
   */
  searchUsers(query: string): Observable<User[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<User[]>(`${this.apiUrl}/search?q=${encodeURIComponent(query)}`, { headers });
  }

  /**
   * Get user activity
   */
  getUserActivity(id: string): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any[]>(`${this.apiUrl}/${id}/activity`, { headers });
  }
}