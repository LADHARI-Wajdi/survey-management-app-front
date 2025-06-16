// features/survey-management/services/survey.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey, SurveyStatus } from '../../../core/models/survey.model';
import { environements } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private apiUrl = `${environements.apiUrl}/surveys`;
  

  constructor(private http: HttpClient) {}

  getAllSurveys(): Observable<Survey[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Survey[]>(this.apiUrl, { headers });
  }

  getSurveyById(id: string): Observable<Survey> {
        const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Survey>(`${this.apiUrl}/${id}`, { headers });
  }

  createSurvey(survey: Partial<Survey>): Observable<Survey> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<Survey>(this.apiUrl, survey, { headers });
  }

  updateSurvey(id: string, survey: Survey): Observable<Survey> {
            const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<Survey>(`${this.apiUrl}/${id}`, survey, { headers });
  }

  deleteSurvey(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  publishSurvey(id: string): Observable<Survey> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<Survey>(`${this.apiUrl}/${id}/publish`, {
      status: SurveyStatus.PUBLISHED,
    }, { headers });
  }

  closeSurvey(id: string): Observable<Survey> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<Survey>(`${this.apiUrl}/${id}/close`, {
      status: SurveyStatus.CLOSED,
    }, { headers });
  }

  getSurveyStatistics(id: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/${id}/statistics`, { headers });
  }

  duplicateSurvey(id: string, newTitle?: string): Observable<Survey> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<Survey>(`${this.apiUrl}/${id}/duplicate`, {
      title: newTitle,
    }, { headers });
  }

  getSurveyTemplates(): Observable<Survey[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Survey[]>(`${this.apiUrl}/templates`, { headers });
  }

  getSurveysByUser(userId: string): Observable<Survey[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Survey[]>(`${this.apiUrl}/user/${userId}`, { headers });
  }

  getRecentSurveys(limit: number = 5): Observable<Survey[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Survey[]>(`${this.apiUrl}/recent?limit=${limit}`, { headers });
  }

  getPopularSurveys(limit: number = 5): Observable<Survey[]> {
    const token = localStorage.getItem('auth_token');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Survey[]>(`${this.apiUrl}/popular?limit=${limit}`, { headers });
  }
}
