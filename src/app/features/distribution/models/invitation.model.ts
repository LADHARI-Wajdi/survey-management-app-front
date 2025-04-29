// features/distribution/models/invitation.model.ts

/**
 * Représente une invitation envoyée pour participer à une enquête
 */
export interface Invitation {
  id?: string;           // ID unique de l'invitation
  surveyId: string;      // ID de l'enquête associée
  recipientEmail: string; // Email du destinataire
  subject: string;       // Sujet de l'email
  message: string;       // Contenu de l'email
  template: string;      // Modèle utilisé
  status: InvitationStatus; // Statut de l'invitation
  sentDate: Date;        // Date d'envoi
  openDate?: Date;       // Date d'ouverture (si ouverte)
  clickDate?: Date;      // Date du clic sur le lien (si cliqué)
  completionDate?: Date; // Date de complétion de l'enquête (si complétée)
  lastReminderDate?: Date; // Date du dernier rappel envoyé
  reminderCount: number; // Nombre de rappels envoyés
  trackingId: string;    // ID de suivi unique pour cette invitation
  createdBy: string;     // ID de l'utilisateur ayant créé l'invitation
}

/**
 * Statut possible d'une invitation
 */
export enum InvitationStatus {
  PENDING = 'pending',     // En attente d'envoi
  SENT = 'sent',           // Envoyée
  OPENED = 'opened',       // Ouverte
  CLICKED = 'clicked',     // Lien cliqué
  COMPLETED = 'completed', // Enquête complétée
  BOUNCED = 'bounced',     // Email retourné (erreur)
  FAILED = 'failed'        // Échec d'envoi
}

/**
 * Statistiques d'invitation pour une enquête
 */
export interface InvitationStatistics {
  sentCount: number;          // Nombre d'invitations envoyées
  openCount: number;          // Nombre d'invitations ouvertes
  clickCount: number;         // Nombre de clics sur les liens
  completeCount: number;      // Nombre d'enquêtes complétées
  openRate: number;           // Taux d'ouverture (%)
  clickRate: number;          // Taux de clic (%)
  completionRate: number;     // Taux de complétion (%)
  averageTimeToOpen?: number; // Temps moyen avant ouverture (minutes)
  averageTimeToClick?: number; // Temps moyen avant clic (minutes)
  averageTimeToComplete?: number; // Temps moyen avant complétion (minutes)
  bounceRate?: number;        // Taux de retour (%)
  failureRate?: number;       // Taux d'échec (%)
}

/**
 * Données pour l'envoi d'invitations
 */
export interface InvitationSendData {
  surveyId: string;           // ID de l'enquête
  recipients: string[];       // Liste des emails destinataires
  subject: string;            // Sujet de l'email
  template: string;           // Modèle à utiliser
  customMessage?: string;     // Message personnalisé (si template = custom)
  sendDate?: Date;            // Date d'envoi (pour planification)
  reminderSettings?: {        // Paramètres de rappel automatique
    enabled: boolean;         // Rappels activés
    frequency: number;        // Fréquence en jours
    maxReminders: number;     // Nombre max de rappels
    reminderTemplate?: string; // Modèle pour les rappels
    reminderSubject?: string;  // Sujet pour les rappels
  };
}

/**
 * Modèle d'email d'invitation
 */
export interface InvitationTemplate {
  id: string;                 // ID unique du modèle
  name: string;               // Nom du modèle
  description: string;        // Description
  subject: string;            // Sujet par défaut
  content: string;            // Contenu HTML du modèle
  isSystem: boolean;          // Modèle système (non supprimable)
  createdBy?: string;         // ID de l'utilisateur ayant créé le modèle
  createdAt: Date;            // Date de création
  updatedAt?: Date;           // Date de dernière modification
}