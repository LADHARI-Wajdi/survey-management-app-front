import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { UserProfileModel } from '../models/user-profile.model';
import { environment } from '../../../../../environements/environment';

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<UserProfileModel[]> {
    return this.http.get<UserProfileModel[]>(this.apiUrl);
  }

  getUserById(id: string): Observable<UserProfileModel> {
    return this.http.get<UserProfileModel>(`${this.apiUrl}/${id}`);
  }

  createUser(user: UserProfileModel): Observable<UserProfileModel> {
    return this.http.post<UserProfileModel>(this.apiUrl, user);
  }

  updateUser(id: string, user: UserProfileModel): Observable<UserProfileModel> {
    return this.http.put<UserProfileModel>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
