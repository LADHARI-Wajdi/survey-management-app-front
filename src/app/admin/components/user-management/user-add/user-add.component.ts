import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, UserRole } from '../../../../core/models/user.model';
import { environements } from '../../../../../environements/environement';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = `${environements.apiUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  changeUserRole(id: string, roles: string[]): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/roles`, { roles });
  }

  getUserStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${role}`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(
      `${this.apiUrl}/search?q=${encodeURIComponent(query)}`
    );
  }

  getUserActivity(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/activity`);
  }
}
