// features/survey-management/services/survey.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey, SurveyStatus } from '../../../core/models/survey.model';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  private apiUrl = '/api/surveys';

  constructor(private http: HttpClient) {}

  getAllSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.apiUrl);
  }

  getSurveyById(id: string): Observable<Survey> {
    return this.http.get<Survey>(`${this.apiUrl}/${id}`);
  }

  createSurvey(survey: Survey): Observable<Survey> {
    return this.http.post<Survey>(this.apiUrl, survey);
  }

  updateSurvey(id: string, survey: Survey): Observable<Survey> {
    return this.http.put<Survey>(`${this.apiUrl}/${id}`, survey);
  }

  deleteSurvey(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  publishSurvey(id: string): Observable<Survey> {
    return this.http.put<Survey>(`${this.apiUrl}/${id}/publish`, {
      status: SurveyStatus.PUBLISHED,
    });
  }

  closeSurvey(id: string): Observable<Survey> {
    return this.http.put<Survey>(`${this.apiUrl}/${id}/close`, {
      status: SurveyStatus.CLOSED,
    });
  }

  getSurveyStatistics(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/statistics`);
  }

  duplicateSurvey(id: string, newTitle?: string): Observable<Survey> {
    return this.http.post<Survey>(`${this.apiUrl}/${id}/duplicate`, {
      title: newTitle,
    });
  }

  getSurveyTemplates(): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiUrl}/templates`);
  }

  getSurveysByUser(userId: string): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiUrl}/user/${userId}`);
  }

  getRecentSurveys(limit: number = 5): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiUrl}/recent?limit=${limit}`);
  }

  getPopularSurveys(limit: number = 5): Observable<Survey[]> {
    return this.http.get<Survey[]>(`${this.apiUrl}/popular?limit=${limit}`);
  }
}
