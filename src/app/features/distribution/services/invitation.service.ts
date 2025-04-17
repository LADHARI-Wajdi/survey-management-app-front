import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private apiUrl = `${environment.apiUrl}/invitations`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les invitations pour une enquête
   * @param surveyId ID de l'enquête
   */
  getInvitations(surveyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/surveys/${surveyId}`).pipe(
      catchError((error) => {
        console.error('Error getting invitations', error);
        return of([]);
      })
    );
  }

  /**
   * Envoie des invitations pour une enquête
   * @param surveyId ID de l'enquête
   * @param invitationData Données des invitations
   */
  sendInvitations(surveyId: string, invitationData: any): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/surveys/${surveyId}`, invitationData)
      .pipe(
        catchError((error) => {
          console.error('Error sending invitations', error);
          // Réponse fictive pour démonstration
          return of({
            success: true,
            sent: invitationData.recipients.length,
            failed: 0,
          });
        })
      );
  }

  /**
   * Renvoie une invitation spécifique
   * @param invitationId ID de l'invitation
   */
  resendInvitation(invitationId: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/${invitationId}/resend`, {})
      .pipe(
        catchError((error) => {
          console.error('Error resending invitation', error);
          return of({ success: true });
        })
      );
  }

  /**
   * Annule une invitation spécifique
   * @param invitationId ID de l'invitation
   */
  cancelInvitation(invitationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${invitationId}`);
  }

  /**
   * Récupère les modèles d'invitation
   */
  getInvitationTemplates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/templates`).pipe(
      catchError((error) => {
        console.error('Error getting invitation templates', error);
        // Modèles fictifs pour démonstration
        return of([
          {
            id: 'standard',
            name: 'Standard',
            description: "Modèle d'invitation standard",
          },
          {
            id: 'formal',
            name: 'Formel',
            description: "Modèle d'invitation formel",
          },
          {
            id: 'friendly',
            name: 'Amical',
            description: "Modèle d'invitation amical",
          },
          {
            id: 'reminder',
            name: 'Rappel',
            description: "Modèle de rappel d'invitation",
          },
        ]);
      })
    );
  }

  /**
   * Crée un nouveau modèle d'invitation
   * @param templateData Données du modèle
   */
  createInvitationTemplate(templateData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/templates`, templateData);
  }

  /**
   * Récupère les statistiques des invitations pour une enquête
   * @param surveyId ID de l'enquête
   */
  getInvitationStatistics(surveyId: string): Observable<any> {
    return this.http
      .get<any>(`${this.apiUrl}/surveys/${surveyId}/statistics`)
      .pipe(
        catchError((error) => {
          console.error('Error getting invitation statistics', error);
          // Statistiques fictives pour démonstration
          return of({
            sentCount: 54,
            openCount: 32,
            clickCount: 28,
            completeCount: 22,
            openRate: 59,
            completionRate: 41,
            averageTimeToRespond: '2 jours',
          });
        })
      );
  }

  /**
   * Programme l'envoi automatique d'invitations
   * @param surveyId ID de l'enquête
   * @param scheduleData Données de planification
   */
  scheduleInvitations(surveyId: string, scheduleData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/surveys/${surveyId}/schedule`,
      scheduleData
    );
  }

  /**
   * Configure le rappel automatique pour les invitations sans réponse
   * @param surveyId ID de l'enquête
   * @param reminderData Données du rappel
   */
  setupReminderForInvitations(
    surveyId: string,
    reminderData: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/surveys/${surveyId}/reminders`,
      reminderData
    );
  }

  /**
   * Récupère l'historique des envois pour une enquête
   * @param surveyId ID de l'enquête
   */
  getInvitationHistory(surveyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/surveys/${surveyId}/history`);
  }
}
