// features/survey-taking/services/survey-response.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environements } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root'
})
export class SurveyResponseService {
  private apiUrl = `${environements.apiUrl}/responses`;

  constructor(private http: HttpClient) { }

  /**
   * Soumet une réponse à une enquête
   * @param surveyId ID de l'enquête
   * @param responseData Données de la réponse
   */
  submitResponse(surveyId: string, responseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/surveys/${surveyId}`, responseData)
      .pipe(
        catchError((error) => {
          console.error('Error submitting response', error);
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Enregistre une réponse partielle pour continuer plus tard
   * @param surveyId ID de l'enquête
   * @param responseData Données partielles de la réponse
   */
  savePartialResponse(surveyId: string, responseData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/surveys/${surveyId}/partial`, responseData)
      .pipe(
        catchError((error) => {
          console.error('Error saving partial response', error);
          return of({ success: false, error: error.message });
        })
      );
  }

  /**
   * Récupère une réponse partielle sauvegardée
   * @param responseId ID de la réponse
   */
  getPartialResponse(responseId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/partial/${responseId}`)
      .pipe(
        catchError((error) => {
          console.error('Error retrieving partial response', error);
          return of(null);
        })
      );
  }

  /**
   * Obtient les réponses d'un utilisateur
   * @param userId ID de l'utilisateur (optionnel, utilise l'utilisateur actuel si non fourni)
   */
  getUserResponses(userId?: string): Observable<any[]> {
    const url = userId ? `${this.apiUrl}/user/${userId}` : `${this.apiUrl}/user`;
    
    return this.http.get<any[]>(url)
      .pipe(
        catchError((error) => {
          console.error('Error retrieving user responses', error);
          return of([]);
        })
      );
  }
}