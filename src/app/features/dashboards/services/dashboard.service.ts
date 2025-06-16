// src/app/features/dashboard/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environements } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environements.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  /**
   * Récupère les statistiques pour le dashboard de l'investigateur
   */
  getInvestigatorStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/investigator/stats`)
      .pipe(
        catchError(() => {
          // En cas d'erreur, retourner des données fictives pour la démonstration
          return of(this.getMockInvestigatorStats());
        })
      );
  }

  /**
   * Récupère les statistiques pour le dashboard du participant
   */
  getParticipantStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/participant/stats`)
      .pipe(
        catchError(() => {
          // En cas d'erreur, retourner des données fictives pour la démonstration
          return of(this.getMockParticipantStats());
        })
      );
  }

  /**
   * Récupère l'activité récente de l'utilisateur
   */
  getRecentActivity(userType: 'investigator' | 'participant'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userType}/activity`)
      .pipe(
        catchError(() => {
          // En cas d'erreur, retourner des données fictives pour la démonstration
          return of(this.getMockActivity(userType));
        })
      );
  }

  /**
   * Récupère les enquêtes récentes pour l'utilisateur
   */
  getRecentSurveys(userType: 'investigator' | 'participant'): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${userType}/surveys`)
      .pipe(
        catchError(() => {
          // En cas d'erreur, retourner des données fictives pour la démonstration
          return of(this.getMockSurveys(userType));
        })
      );
  }

  /**
   * Données fictives pour le dashboard de l'investigateur
   */
  private getMockInvestigatorStats(): any {
    return {
      activesSurveys: 12,
      monthlyResponses: 854,
      completionRate: 68,
      sentInvitations: 1254,
      totalSurveys: 25,
      totalResponses: 3542,
      averageTimeToRespond: 2.4  // En jours
    };
  }

  /**
   * Données fictives pour le dashboard du participant
   */
  private getMockParticipantStats(): any {
    return {
      pendingSurveys: 3,
      completedSurveys: 18,
      totalParticipation: 21,
      invitationAcceptanceRate: 87,
      averageCompletionTime: 15.2  // En minutes
    };
  }

  /**
   * Données fictives d'activité
   */
  private getMockActivity(userType: 'investigator' | 'participant'): any[] {
    if (userType === 'investigator') {
      return [
        {
          id: 'act1',
          type: 'response',
          description: 'Nouvelle réponse - Satisfaction Client Q2',
          time: 'Il y a 5 min'
        },
        {
          id: 'act2',
          type: 'publication',
          description: 'Enquête publiée - Évaluation Produit',
          time: 'Il y a 1 heure'
        },
        {
          id: 'act3',
          type: 'invitation',
          description: '15 invitations envoyées - Feedback Service Client',
          time: 'Il y a 3 heures'
        },
        {
          id: 'act4',
          type: 'response',
          description: '5 nouvelles réponses - Sondage Marketing Q1',
          time: 'Il y a 1 jour'
        },
        {
          id: 'act5',
          type: 'creation',
          description: 'Nouvelle enquête créée - Recherche utilisateurs',
          time: 'Il y a 2 jours'
        }
      ];
    } else {
      return [
        {
          id: 'act1',
          type: 'invitation',
          description: 'Invitation reçue - Enquête de satisfaction',
          time: 'Il y a 2 heures'
        },
        {
          id: 'act2',
          type: 'completion',
          description: 'Enquête complétée - Évaluation Produit',
          time: 'Il y a 1 jour'
        },
        {
          id: 'act3',
          type: 'reminder',
          description: 'Rappel - Enquête sur les habitudes de consommation',
          time: 'Il y a 2 jours'
        },
        {
          id: 'act4',
          type: 'completion',
          description: 'Enquête complétée - Feedback Interface',
          time: 'Il y a 5 jours'
        }
      ];
    }
  }

  /**
   * Données fictives d'enquêtes
   */
  private getMockSurveys(userType: 'investigator' | 'participant'): any[] {
    if (userType === 'investigator') {
      return [
        {
          id: 'surv1',
          title: 'Satisfaction Client Q2',
          status: 'active',
          responseCount: 127,
          completionRate: 72,
          creationDate: new Date(2023, 3, 15)
        },
        {
          id: 'surv2',
          title: 'Évaluation Produit',
          status: 'active',
          responseCount: 89,
          completionRate: 65,
          creationDate: new Date(2023, 2, 28)
        },
        {
          id: 'surv3',
          title: 'Feedback Service Client',
          status: 'draft',
          responseCount: 0,
          completionRate: 0,
          creationDate: new Date(2023, 4, 5)
        },
        {
          id: 'surv4',
          title: 'Sondage Marketing Q1',
          status: 'closed',
          responseCount: 213,
          completionRate: 84,
          creationDate: new Date(2023, 0, 10)
        }
      ];
    } else {
      return [
        {
          id: 'surv1',
          title: 'Enquête de satisfaction',
          status: 'pending',
          deadline: new Date(2023, 4, 20),
          estimatedTime: 10,
          company: 'Acme Corp'
        },
        {
          id: 'surv2',
          title: 'Évaluation Produit X',
          status: 'pending',
          deadline: new Date(2023, 4, 25),
          estimatedTime: 15,
          company: 'TechInnov'
        },
        {
          id: 'surv3',
          title: 'Habitudes de consommation',
          status: 'completed',
          completionDate: new Date(2023, 3, 28),
          company: 'Consumer Research'
        },
        {
          id: 'surv4',
          title: 'Feedback Interface Utilisateur',
          status: 'completed',
          completionDate: new Date(2023, 3, 15),
          company: 'UX Solutions'
        }
      ];
    }
  }
}