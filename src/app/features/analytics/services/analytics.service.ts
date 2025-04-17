import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getSurveyAnalytics(
    surveyId: string,
    period: string = 'all'
  ): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/surveys/${surveyId}?period=${period}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching survey analytics', error);
          // Retourner des données fictives pour la démonstration en cas d'erreur
          return of(this.getMockSurveyAnalytics());
        })
      );
  }

  getQuestionAnalytics(questionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/questions/${questionId}`).pipe(
      catchError((error) => {
        console.error('Error fetching question analytics', error);
        return of({});
      })
    );
  }

  exportSurveyData(surveyId: string, format: string = 'csv'): Observable<Blob> {
    return this.http
      .get(`${this.apiUrl}/surveys/${surveyId}/export/${format}`, {
        responseType: 'blob',
      })
      .pipe(
        catchError((error) => {
          console.error('Error exporting survey data', error);
          // Retourner un blob vide en cas d'erreur
          return of(new Blob([]));
        })
      );
  }

  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dashboard`).pipe(
      catchError((error) => {
        console.error('Error fetching dashboard stats', error);
        // Retourner des données fictives pour la démonstration en cas d'erreur
        return of(this.getMockDashboardStats());
      })
    );
  }

  // Méthode pour obtenir les réponses récentes d'une enquête
  getRecentResponses(surveyId: string, limit: number = 5): Observable<any[]> {
    return this.http
      .get<any[]>(
        `${this.apiUrl}/surveys/${surveyId}/responses/recent?limit=${limit}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error fetching recent responses', error);
          // Retourner des données fictives pour la démonstration en cas d'erreur
          return of(this.getMockRecentResponses());
        })
      );
  }

  // Méthode pour obtenir les tendances des réponses dans le temps
  getResponseTrends(
    surveyId: string,
    period: string = 'month'
  ): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/surveys/${surveyId}/trends?period=${period}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching response trends', error);
          return of({});
        })
      );
  }

  // Méthode pour comparer les résultats de plusieurs enquêtes
  compareSurveys(surveyIds: string[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/compare`, { surveyIds }).pipe(
      catchError((error) => {
        console.error('Error comparing surveys', error);
        return of({});
      })
    );
  }

  // Méthodes pour générer des données fictives pour la démonstration
  private getMockSurveyAnalytics(): any {
    return {
      totalResponses: 254,
      completionRate: 76,
      averageRating: 4.2,
      averageTime: 204, // secondes
      questions: [
        {
          id: 'q1',
          title: 'Comment évaluez-vous la qualité de notre service client ?',
          type: 'rating',
          responseRate: 98,
          averageRating: 4.2,
          ratingDistribution: [
            { rating: 1, count: 12, percentage: 5 },
            { rating: 2, count: 30, percentage: 12 },
            { rating: 3, count: 45, percentage: 18 },
            { rating: 4, count: 115, percentage: 45 },
            { rating: 5, count: 52, percentage: 20 },
          ],
        },
        {
          id: 'q2',
          title:
            'Quelle fonctionnalité aimeriez-vous voir ajoutée à notre produit ?',
          type: 'text_short',
          responseRate: 65,
          wordFrequency: [
            { text: 'intégration', frequency: 45 },
            { text: 'mobile', frequency: 38 },
            { text: 'notifications', frequency: 32 },
            { text: 'personnalisation', frequency: 28 },
            { text: 'rapports', frequency: 25 },
          ],
        },
        {
          id: 'q3',
          title: 'Quelle est votre fonctionnalité préférée ?',
          type: 'single_choice',
          responseRate: 95,
          optionCounts: [
            {
              optionId: 'opt1',
              optionText: 'Interface utilisateur',
              count: 98,
              percentage: 38,
            },
            {
              optionId: 'opt2',
              optionText: 'Rapports et analyses',
              count: 82,
              percentage: 32,
            },
            {
              optionId: 'opt3',
              optionText: 'Support client',
              count: 44,
              percentage: 17,
            },
            {
              optionId: 'opt4',
              optionText: 'Intégrations',
              count: 30,
              percentage: 13,
            },
          ],
        },
      ],
    };
  }

  private getMockDashboardStats(): any {
    return {
      totalSurveys: 15,
      activeSurveys: 8,
      totalResponses: 1287,
      averageCompletionRate: 72,
    };
  }

  private getMockRecentResponses(): any[] {
    return [
      { user: 'John D.', rating: 5, date: new Date(Date.now() - 300000) },
      { user: 'Sandra M.', rating: 4, date: new Date(Date.now() - 1200000) },
      { user: 'Mark L.', rating: 3, date: new Date(Date.now() - 4500000) },
      { user: 'Emma T.', rating: 4, date: new Date(Date.now() - 9000000) },
      { user: 'Robert K.', rating: 2, date: new Date(Date.now() - 18000000) },
    ];
  }
}
