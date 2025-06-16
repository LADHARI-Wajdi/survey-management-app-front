import { User } from '../../../core/models/user.model';

export interface SurveyParticipant {
  id: string;
  surveyId: string;
  userId?: string; // ID utilisateur si authentifié
  anonymous: boolean;
  invitationToken?: string; // Token d'invitation pour les participants anonymes
  status: ParticipantStatus;
  progressPercentage: number;
  startedAt: Date;
  lastActivityAt: Date;
  completedAt?: Date;
  metadata?: ParticipantMetadata;
  user?: User; // Utilisateur associé (optionnel)
}

/**
 * Statut de participation d'un répondant à une enquête
 */
export enum ParticipantStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

/**
 * Métadonnées collectées sur le participant
 */
export interface ParticipantMetadata {
  ipAddress?: string;
  userAgent?: string;
  browser?: string;
  os?: string;
  device?: 'desktop' | 'tablet' | 'mobile';
  language?: string;
  referrer?: string;
  geolocation?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
}

/**
 * Progrès d'un participant dans une enquête
 */
export interface ParticipantProgress {
  completedSections: string[]; // IDs des sections complétées
  completedQuestions: string[]; // IDs des questions complétées
  currentSection?: string; // ID de la section actuelle
  currentQuestion?: string; // ID de la question actuelle
  lastSaved: Date; // Dernière sauvegarde des réponses
  timeSpent: number; // Temps passé en secondes
}

/**
 * Réponse du participant à une question
 */
export interface ParticipantResponse {
  id: string;
  participantId: string;
  surveyId: string;
  questionId: string;
  sectionId: string;
  value: any; // La valeur peut être de différents types selon le type de question
  skipped: boolean; // Si la question a été sautée
  timeSpent?: number; // Temps passé sur cette question (en secondes)
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Brouillon de réponse à une enquête
 */
export interface SurveyDraft {
  id: string;
  participantId: string;
  surveyId: string;
  responses: ParticipantResponse[];
  progress: ParticipantProgress;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date; // Date d'expiration du brouillon
}

/**
 * État du stockage hors-ligne pour les participants
 */
export interface OfflineStorageState {
  drafts: SurveyDraft[];
  pendingSubmissions: {
    draftId: string;
    surveyId: string;
    lastAttempt?: Date;
    attempts: number;
  }[];
  lastSyncDate: Date;
}
