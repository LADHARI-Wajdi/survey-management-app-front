// src/app/features/participant-dashboard/services/participant-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environements } from '../../../../environements/environement';

interface ParticipantStats {
  availableSurveys: number;
  completedSurveys: number;
  totalResponses: number;
  avgCompletionTime: number; // En secondes
}

@Injectable({
  providedIn: 'root'
})
export class ParticipantDashboardService {
  private apiUrl = `${environements.apiUrl}/participant`;

  constructor(private http: HttpClient) { }

  /**
   * Récupérer les statistiques du tableau de bord du participant
   */
  getParticipantStats(): Observable<ParticipantStats> {
    return this.http.get<ParticipantStats>(`${this.apiUrl}/dashboard/stats`)
      .pipe(
        catchError(this.handleError<ParticipantStats>('getParticipantStats', this.getMockStats()))
      );
  }

  /**
   * Récupérer les enquêtes disponibles pour le participant
   */
  getAvailableSurveys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/surveys/available`)
      .pipe(
        catchError(this.handleError<any[]>('getAvailableSurveys', []))
      );
  }

  /**
   * Récupérer les enquêtes complétées par le participant
   */
  getCompletedSurveys(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/surveys/completed`)
      .pipe(
        catchError(this.handleError<any[]>('getCompletedSurveys', []))
      );
  }

  /**
   * Gestionnaire d'erreur
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      // Retourner un résultat vide ou simulé pour continuer l'application
      return of(result as T);
    };
  }

  /**
   * Générer des données mock pour les tests
   */
  private getMockStats(): ParticipantStats {
    return {
      availableSurveys: 3,
      completedSurveys: 7,
      totalResponses: 15,
      avgCompletionTime: 187 // 3 minutes et 7 secondes
    };
  }
}