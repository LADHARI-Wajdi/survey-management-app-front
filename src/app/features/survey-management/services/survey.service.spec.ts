import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environements } from '../../../../environements/environement';
import { UserProfile } from '../../../core/authentication/models/user.model';



@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = `${environements.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserProfile): Observable<UserProfile> {
    return this.http.post<UserProfile>(this.apiUrl, user);
  }

  updateUser(id: string, user: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}