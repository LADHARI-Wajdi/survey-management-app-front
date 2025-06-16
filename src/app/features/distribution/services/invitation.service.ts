// features/distribution/services/invitation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { 
  Invitation, 
  InvitationStatistics, 
  InvitationSendData, 
  InvitationTemplate,
  InvitationStatus 
} from '../models/invitation.model';
import { environements } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private apiUrl = `${environements.apiUrl}/invitations`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les invitations pour une enquête
   * @param surveyId ID de l'enquête
   * @returns Liste des invitations
   */
  getInvitations(surveyId: string): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`${this.apiUrl}/surveys/${surveyId}`).pipe(
      catchError((error) => {
        console.error('Error getting invitations', error);
        // Pour la démonstration, on retourne un tableau vide
        return of([]);
      })
    );
  }

  /**
   * Envoie des invitations pour une enquête
   * @param surveyId ID de l'enquête
   * @param invitationData Données des invitations
   * @returns Résultat de l'opération
   */
  sendInvitations(surveyId: string, invitationData: InvitationSendData): Observable<any> {
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
   * Récupère une invitation par son ID
   * @param invitationId ID de l'invitation
   * @returns Détails de l'invitation
   */
  getInvitationById(invitationId: string): Observable<Invitation> {
    return this.http.get<Invitation>(`${this.apiUrl}/${invitationId}`).pipe(
      catchError((error) => {
        console.error('Error getting invitation details', error);
        // Pour la démonstration, on retourne une invitation fictive
        return of({
          id: invitationId,
          surveyId: 'survey-123',
          recipientEmail: 'test@example.com',
          subject: 'Invitation à participer à notre enquête',
          message: 'Merci de participer à notre enquête',
          template: 'standard',
          status: InvitationStatus.SENT,
          sentDate: new Date(),
          reminderCount: 0,
          trackingId: 'track-123',
          createdBy: 'user-123'
        });
      })
    );
  }

  /**
   * Renvoie une invitation spécifique
   * @param invitationId ID de l'invitation
   * @returns Résultat de l'opération
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
   * @returns Résultat de l'opération
   */
  cancelInvitation(invitationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${invitationId}`).pipe(
      catchError((error) => {
        console.error('Error canceling invitation', error);
        return of({ success: true });
      })
    );
  }

  /**
   * Récupère les modèles d'invitation disponibles
   * @returns Liste des modèles d'invitation
   */
  getInvitationTemplates(): Observable<InvitationTemplate[]> {
    return this.http.get<InvitationTemplate[]>(`${this.apiUrl}/templates`).pipe(
      catchError((error) => {
        console.error('Error getting invitation templates', error);
        // Modèles fictifs pour démonstration
        return of([
          {
            id: 'standard',
            name: 'Standard',
            description: "Modèle d'invitation standard",
            subject: 'Invitation à participer à notre enquête',
            content: '<p>Bonjour,</p><p>Vous êtes invité(e) à participer à notre enquête.</p><p>Merci de prendre quelques minutes pour y répondre.</p><p>Cordialement,<br>L\'équipe Survey Management</p>',
            isSystem: true,
            createdAt: new Date()
          },
          {
            id: 'formal',
            name: 'Formel',
            description: "Modèle d'invitation formel",
            subject: 'Invitation à participer à notre enquête',
            content: '<p>Madame, Monsieur,</p><p>Nous vous invitons à participer à notre enquête.</p><p>Votre contribution est essentielle pour nous aider à améliorer nos services.</p><p>Nous vous remercions par avance pour votre participation.</p><p>Veuillez agréer nos salutations distinguées,<br>L\'équipe Survey Management</p>',
            isSystem: true,
            createdAt: new Date()
          },
          {
            id: 'friendly',
            name: 'Amical',
            description: "Modèle d'invitation amical",
            subject: 'On aimerait ton avis !',
            content: '<p>Salut !</p><p>On aimerait avoir ton avis sur notre enquête !</p><p>Ça ne prendra que quelques minutes et ton retour est vraiment important pour nous.</p><p>Merci d\'avance !<br>L\'équipe Survey Management</p>',
            isSystem: true,
            createdAt: new Date()
          },
          {
            id: 'reminder',
            name: 'Rappel',
            description: "Modèle de rappel d'invitation",
            subject: 'Rappel : Invitation à participer à notre enquête',
            content: '<p>Bonjour,</p><p>Nous vous rappelons que vous êtes invité(e) à participer à notre enquête.</p><p>Votre avis compte beaucoup pour nous et il ne vous faudra que quelques minutes pour répondre.</p><p>Merci pour votre participation,<br>L\'équipe Survey Management</p>',
            isSystem: true,
            createdAt: new Date()
          }
        ]);
      })
    );
  }

  /**
   * Crée un nouveau modèle d'invitation personnalisé
   * @param templateData Données du modèle
   * @returns Modèle créé
   */
  createInvitationTemplate(templateData: Partial<InvitationTemplate>): Observable<InvitationTemplate> {
    return this.http.post<InvitationTemplate>(`${this.apiUrl}/templates`, templateData).pipe(
      catchError((error) => {
        console.error('Error creating invitation template', error);
        // Pour la démonstration, on retourne un template fictif
        return of({
          id: `custom-${Date.now()}`,
          name: templateData.name || 'Personnalisé',
          description: templateData.description || "Modèle personnalisé",
          subject: templateData.subject || "Invitation à participer",
          content: templateData.content || "",
          isSystem: false,
          createdBy: 'current-user',
          createdAt: new Date()
        });
      })
    );
  }

  /**
   * Récupère les statistiques des invitations pour une enquête
   * @param surveyId ID de l'enquête
   * @returns Statistiques des invitations
   */
  getInvitationStatistics(surveyId: string): Observable<InvitationStatistics> {
    return this.http
      .get<InvitationStatistics>(`${this.apiUrl}/surveys/${surveyId}/statistics`)
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
            clickRate: 52,
            completionRate: 41,
            averageTimeToOpen: 120, // minutes
            averageTimeToClick: 180, // minutes
            averageTimeToComplete: 240, // minutes
            bounceRate: 5,
            failureRate: 2
          });
        })
      );
  }

  /**
   * Programme l'envoi automatique d'invitations
   * @param surveyId ID de l'enquête
   * @param scheduleData Données de planification
   * @returns Résultat de l'opération
   */
  scheduleInvitations(surveyId: string, scheduleData: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/surveys/${surveyId}/schedule`,
      scheduleData
    ).pipe(
      catchError((error) => {
        console.error('Error scheduling invitations', error);
        return of({ success: true });
      })
    );
  }

  /**
   * Configure le rappel automatique pour les invitations sans réponse
   * @param surveyId ID de l'enquête
   * @param reminderData Données du rappel
   * @returns Résultat de l'opération
   */
  setupReminderForInvitations(
    surveyId: string,
    reminderData: any
  ): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/surveys/${surveyId}/reminders`,
      reminderData
    ).pipe(
      catchError((error) => {
        console.error('Error setting up reminders', error);
        return of({ success: true });
      })
    );
  }

  /**
   * Récupère l'historique des envois pour une enquête
   * @param surveyId ID de l'enquête
   * @returns Historique des envois
   */
  getInvitationHistory(surveyId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/surveys/${surveyId}/history`).pipe(
      catchError((error) => {
        console.error('Error getting invitation history', error);
        // Pour la démonstration, on retourne un historique fictif
        return of([
          {
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            count: 30,
            type: 'initial',
            sentBy: 'John Doe'
          },
          {
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            count: 15,
            type: 'reminder',
            sentBy: 'John Doe'
          },
          {
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            count: 9,
            type: 'reminder',
            sentBy: 'System'
          }
        ]);
      })
    );
  }
}