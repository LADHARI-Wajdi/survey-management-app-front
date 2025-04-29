// src/app/features/survey-taking/services/participant.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';
import { LoggerService } from '../../../core/services/logger.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/authentication/services/auth.service';
import { SurveyParticipant, ParticipantStatus, ParticipantResponse, SurveyDraft, ParticipantProgress } from '../models/participant.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  private apiUrl = `${environements.apiUrl}/survey-participants`;
  
  // Observable pour suivre le participant actuel
  private currentParticipantSubject = new BehaviorSubject<SurveyParticipant | null>(null);
  public currentParticipant$ = this.currentParticipantSubject.asObservable();
  
  // Observable pour suivre le progrès du participant
  private participantProgressSubject = new BehaviorSubject<ParticipantProgress | null>(null);
  public participantProgress$ = this.participantProgressSubject.asObservable();
  
  // Pour le stockage hors ligne
  private offlineMode = false;
  private localStorageKey = 'survey_app_offline_data';

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {
    // Vérifier si le navigateur supporte le stockage local
    this.offlineMode = this.checkOfflineSupport();
    
    // Restaurer les données en cours si elles existent
    this.restoreCurrentParticipant();
  }

  /**
   * Vérifie si le navigateur supporte le stockage local
   */
  private checkOfflineSupport(): boolean {
    try {
      if ('localStorage' in window && window.localStorage !== null) {
        // Test d'écriture/lecture pour confirmer l'accès
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      }
      return false;
    } catch (e) {
      this.logger.warn('Le stockage local n\'est pas supporté. Le mode hors ligne ne sera pas disponible.', e);
      return false;
    }
  }

  /**
   * Restaure les données du participant actuel depuis le stockage local
   */
  private restoreCurrentParticipant(): void {
    if (!this.offlineMode) return;
    
    try {
      const currentParticipantJson = localStorage.getItem('current_survey_participant');
      if (currentParticipantJson) {
        const participant = JSON.parse(currentParticipantJson);
        
        // Conversion des dates
        participant.startedAt = new Date(participant.startedAt);
        participant.lastActivityAt = new Date(participant.lastActivityAt);
        if (participant.completedAt) {
          participant.completedAt = new Date(participant.completedAt);
        }
        
        this.currentParticipantSubject.next(participant);
        
        const progressJson = localStorage.getItem('current_survey_progress');
        if (progressJson) {
          const progress = JSON.parse(progressJson);
          progress.lastSaved = new Date(progress.lastSaved);
          this.participantProgressSubject.next(progress);
        }
        
        this.logger.info('Session de participant restaurée', { participantId: participant.id });
      }
    } catch (e) {
      this.logger.error('Erreur lors de la restauration de la session participant', e);
    }
  }

  /**
   * Commence une enquête en tant que participant
   * @param surveyId ID de l'enquête
   * @param invitationToken Token d'invitation (pour participants anonymes)
   */
  startSurvey(surveyId: string, invitationToken?: string): Observable<SurveyParticipant> {
    // Vérifier s'il y a un utilisateur connecté
    const currentUser = this.authService.currentUserValue;
    const isAnonymous = !currentUser;
    
    const payload = {
      surveyId,
      invitationToken,
      anonymous: isAnonymous
    };
    
    return this.http.post<SurveyParticipant>(`${this.apiUrl}/start`, payload).pipe(
      tap(participant => {
        // Sauvegarder les données du participant
        this.currentParticipantSubject.next(participant);
        
        // Initialiser le progrès
        const initialProgress: ParticipantProgress = {
          completedSections: [],
          completedQuestions: [],
          lastSaved: new Date(),
          timeSpent: 0
        };
        this.participantProgressSubject.next(initialProgress);
        
        // Sauvegarder en local si le mode hors ligne est supporté
        if (this.offlineMode) {
          localStorage.setItem('current_survey_participant', JSON.stringify(participant));
          localStorage.setItem('current_survey_progress', JSON.stringify(initialProgress));
        }
        
        this.logger.info('Enquête démarrée', { participantId: participant.id, surveyId });
      }),
      catchError(error => {
        if (error.status === 404) {
          this.notificationService.error('Enquête introuvable ou expirée.');
        } else if (error.status === 403) {
          this.notificationService.error('Vous n\'êtes pas autorisé à participer à cette enquête.');
        } else {
          this.notificationService.error('Erreur lors du démarrage de l\'enquête.');
        }
        
        this.logger.error('Erreur lors du démarrage de l\'enquête', { error, surveyId });
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère les informations d'un participant
   * @param participantId ID du participant
   */
  getParticipant(participantId: string): Observable<SurveyParticipant> {
    return this.http.get<SurveyParticipant>(`${this.apiUrl}/${participantId}`).pipe(
      catchError(error => {
        this.logger.error('Erreur lors de la récupération du participant', { error, participantId });
        return throwError(() => error);
      })
    );
  }

  /**
   * Récupère le progrès d'un participant
   * @param participantId ID du participant
   */
  getParticipantProgress(participantId: string): Observable<ParticipantProgress> {
    return this.http.get<ParticipantProgress>(`${this.apiUrl}/${participantId}/progress`).pipe(
      tap(progress => {
        this.participantProgressSubject.next(progress);
        
        if (this.offlineMode) {
          localStorage.setItem('current_survey_progress', JSON.stringify(progress));
        }
      }),
      catchError(error => {
        this.logger.error('Erreur lors de la récupération du progrès', { error, participantId });
        return throwError(() => error);
      })
    );
  }

  /**
   * Sauvegarde une réponse à une question
   * @param response Réponse du participant
   */
  saveResponse(response: ParticipantResponse): Observable<ParticipantResponse> {
    // Sauvegarder d'abord localement si le mode hors ligne est activé
    if (this.offlineMode) {
      this.saveResponseLocally(response);
    }
    
    return this.http.post<ParticipantResponse>(`${this.apiUrl}/responses`, response).pipe(
      tap(savedResponse => {
        // Mettre à jour le progrès
        this.updateProgressAfterResponse(response.questionId);
        
        this.logger.info('Réponse sauvegardée', { 
          participantId: response.participantId, 
          questionId: response.questionId 
        });
      }),
      catchError(error => {
        this.logger.error('Erreur lors de la sauvegarde de la réponse', { error, response });
        
        // Si hors ligne, conserver la réponse localement et gérer la soumission ultérieure
        if (this.offlineMode && (error.status === 0 || error.status === 504)) {
          this.notificationService.info('Votre réponse a été sauvegardée localement et sera synchronisée une fois la connexion rétablie.');
          return of(response); // Retourner la réponse comme si elle avait été sauvegardée
        }
        
        this.notificationService.error('Erreur lors de la sauvegarde de votre réponse.');
        return throwError(() => error);
      })
    );
  }

  /**
   * Met à jour le progrès du participant après avoir répondu à une question
   * @param questionId ID de la question répondue
   */
  private updateProgressAfterResponse(questionId: string): void {
    const currentProgress = this.participantProgressSubject.value;
    if (!currentProgress) return;
    
    // Ajouter la question aux questions complétées si elle n'y est pas déjà
    if (!currentProgress.completedQuestions.includes(questionId)) {
      const updatedProgress: ParticipantProgress = {
        ...currentProgress,
        completedQuestions: [...currentProgress.completedQuestions, questionId],
        lastSaved: new Date()
      };
      
      this.participantProgressSubject.next(updatedProgress);
      
      if (this.offlineMode) {
        localStorage.setItem('current_survey_progress', JSON.stringify(updatedProgress));
      }
    }
    
    // Mettre à jour le participant actuel avec le nouveau pourcentage
    const currentParticipant = this.currentParticipantSubject.value;
    if (currentParticipant) {
      // Le calcul du pourcentage dépendrait du nombre total de questions dans l'enquête
      // Ici on simule un calcul simple
      const updatedParticipant = {
        ...currentParticipant,
        progressPercentage: Math.min(100, Math.round((currentProgress.completedQuestions.length / 10) * 100)),
        lastActivityAt: new Date()
      };
      
      this.currentParticipantSubject.next(updatedParticipant);
      
      if (this.offlineMode) {
        localStorage.setItem('current_survey_participant', JSON.stringify(updatedParticipant));
      }
    }
  }

  /**
   * Sauvegarde une réponse localement (pour le mode hors ligne)
   * @param response Réponse à sauvegarder
   */
  private saveResponseLocally(response: ParticipantResponse): void {
    try {
      // Récupérer les brouillons existants
      const offlineDataJson = localStorage.getItem(this.localStorageKey);
      const offlineData = offlineDataJson ? JSON.parse(offlineDataJson) : { drafts: [], pendingSubmissions: [], lastSyncDate: new Date() };
      
      // Rechercher un brouillon existant pour ce participant/enquête
      let draft = offlineData.drafts.find((d: SurveyDraft) => 
        d.participantId === response.participantId && d.surveyId === response.surveyId
      );
      
      if (!draft) {
        // Créer un nouveau brouillon si nécessaire
        draft = {
          id: `draft_${new Date().getTime()}`,
          participantId: response.participantId,
          surveyId: response.surveyId,
          responses: [],
          progress: this.participantProgressSubject.value || {
            completedSections: [],
            completedQuestions: [],
            lastSaved: new Date(),
            timeSpent: 0
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };
        offlineData.drafts.push(draft);
      }
      
      // Mettre à jour ou ajouter la réponse dans le brouillon
      const existingResponseIndex = draft.responses.findIndex((r: ParticipantResponse) => 
        r.questionId === response.questionId
      );
      
      if (existingResponseIndex >= 0) {
        draft.responses[existingResponseIndex] = response;
      } else {
        draft.responses.push(response);
      }
      
      draft.updatedAt = new Date();
      
      // Mettre à jour les brouillons dans le stockage local
      localStorage.setItem(this.localStorageKey, JSON.stringify(offlineData));
      
      this.logger.info('Réponse sauvegardée localement', { 
        participantId: response.participantId, 
        questionId: response.questionId 
      });
    } catch (e) {
      this.logger.error('Erreur lors de la sauvegarde locale de la réponse', e);
    }
  }

  /**
   * Termine une enquête
   * @param participantId ID du participant
   */
  completeSurvey(participantId: string): Observable<SurveyParticipant> {
    return this.http.put<SurveyParticipant>(`${this.apiUrl}/${participantId}/complete`, {}).pipe(
      tap(participant => {
        this.currentParticipantSubject.next(participant);
        
        if (this.offlineMode) {
          localStorage.setItem('current_survey_participant', JSON.stringify(participant));
          
          // Nettoyer après soumission complète
          setTimeout(() => {
            localStorage.removeItem('current_survey_participant');
            localStorage.removeItem('current_survey_progress');
          }, 5000);
        }
        
        this.logger.info('Enquête terminée', { participantId });
        this.notificationService.success('Enquête terminée avec succès. Merci de votre participation !');
      }),
      catchError(error => {
        this.logger.error('Erreur lors de la finalisation de l\'enquête', { error, participantId });
        
        // Si hors ligne, marquer pour soumission ultérieure
        if (this.offlineMode && (error.status === 0 || error.status === 504)) {
          this.addPendingSubmission(participantId);
          this.notificationService.info('Votre enquête a été enregistrée localement et sera soumise une fois la connexion rétablie.');
          
          // Simuler une complétion réussie pour l'utilisateur
          const currentParticipant = this.currentParticipantSubject.value;
          if (currentParticipant) {
            const simulatedCompletion: SurveyParticipant = {
              ...currentParticipant,
              status: ParticipantStatus.COMPLETED,
              progressPercentage: 100,
              completedAt: new Date()
            };
            return of(simulatedCompletion);
          }
        }
        
        this.notificationService.error('Erreur lors de la finalisation de l\'enquête. Veuillez réessayer.');
        return throwError(() => error);
      })
    );
  }

  /**
   * Ajoute une soumission en attente pour traitement ultérieur
   * @param participantId ID du participant
   */
  private addPendingSubmission(participantId: string): void {
    if (!this.offlineMode) return;
    
    try {
      const offlineDataJson = localStorage.getItem(this.localStorageKey);
      const offlineData = offlineDataJson ? JSON.parse(offlineDataJson) : { drafts: [], pendingSubmissions: [], lastSyncDate: new Date() };
      
      const currentParticipant = this.currentParticipantSubject.value;
      if (!currentParticipant) return;
      
      // Vérifier si cette soumission est déjà en attente
      const existingSubmission = offlineData.pendingSubmissions.find(
        (s: any) => s.participantId === participantId
      );
      
      if (!existingSubmission) {
        offlineData.pendingSubmissions.push({
          participantId,
          surveyId: currentParticipant.surveyId,
          lastAttempt: new Date(),
          attempts: 1
        });
        
        localStorage.setItem(this.localStorageKey, JSON.stringify(offlineData));
        this.logger.info('Soumission d\'enquête mise en attente', { participantId });
      }
    } catch (e) {
      this.logger.error('Erreur lors de l\'ajout d\'une soumission en attente', e);
    }
  }

  /**
   * Synchronise les données hors ligne avec le serveur
   */
  synchronizeOfflineData(): Observable<boolean> {
    if (!this.offlineMode) {
      return of(true);
    }
    
    try {
      const offlineDataJson = localStorage.getItem(this.localStorageKey);
      if (!offlineDataJson) {
        return of(true); // Pas de données à synchroniser
      }
      
      const offlineData = JSON.parse(offlineDataJson);
      
      // Synchroniser les réponses en attente
      const syncTasks: Observable<any>[] = [];
      
      // Traiter les soumissions d'enquête en attente
      for (const submission of offlineData.pendingSubmissions) {
        syncTasks.push(
          this.http.put<SurveyParticipant>(
            `${this.apiUrl}/${submission.participantId}/complete`, {}
          ).pipe(
            tap(() => {
              this.logger.info('Soumission d\'enquête synchronisée', { participantId: submission.participantId });
            }),
            catchError(error => {
              this.logger.error('Échec de synchronisation d\'une soumission', { error, submission });
              return of(null); // Continuer avec la prochaine tâche
            })
          )
        );
      }
      
      // Si pas de tâches, retourner succès immédiatement
      if (syncTasks.length === 0) {
        return of(true);
      }
      
      // Exécuter toutes les tâches de synchronisation
      return forkJoin(syncTasks).pipe(
        map(results => {
          const successCount = results.filter(r => r !== null).length;
          
          if (successCount === syncTasks.length) {
            // Nettoyage des données synchronisées
            localStorage.removeItem(this.localStorageKey);
            this.notificationService.success('Toutes les données ont été synchronisées avec succès.');
            return true;
          } else {
            this.notificationService.warning(`${successCount} sur ${syncTasks.length} éléments synchronisés. Les autres seront réessayés plus tard.`);
            return false;
          }
        }),
        catchError(error => {
          this.logger.error('Erreur lors de la synchronisation des données hors ligne', error);
          this.notificationService.error('Erreur lors de la synchronisation des données.');
          return of(false);
        })
      );
    } catch (e) {
      this.logger.error('Erreur lors du traitement des données hors ligne', e);
      return of(false);
    }
  }

  /**
   * Récupère les réponses d'un participant
   * @param participantId ID du participant
   */
  getParticipantResponses(participantId: string): Observable<ParticipantResponse[]> {
    return this.http.get<ParticipantResponse[]>(`${this.apiUrl}/${participantId}/responses`).pipe(
      catchError(error => {
        this.logger.error('Erreur lors de la récupération des réponses', { error, participantId });
        return throwError(() => error);
      })
    );
  }

  /**
   * Vérifie si une personne peut participer à une enquête via un token d'invitation
   * @param surveyId ID de l'enquête
   * @param token Token d'invitation
   */
  validateInvitationToken(surveyId: string, token: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/validate-token`, { surveyId, token }).pipe(
      map(response => true),
      catchError(error => {
        if (error.status === 404 || error.status === 403) {
          return of(false);
        }
        this.logger.error('Erreur lors de la validation du token', { error, surveyId, token });
        return throwError(() => error);
      })
    );
  }

  /**
   * Supprime la session active du participant
   */
  clearCurrentParticipant(): void {
    this.currentParticipantSubject.next(null);
    this.participantProgressSubject.next(null);
    
    if (this.offlineMode) {
      localStorage.removeItem('current_survey_participant');
      localStorage.removeItem('current_survey_progress');
    }
  }

  /**
   * Vérifie si le participant a une session active
   */
  hasActiveSession(): boolean {
    return !!this.currentParticipantSubject.value;
  }
}

import { forkJoin } from 'rxjs';
import { environements } from '../../../../environements/environement';
