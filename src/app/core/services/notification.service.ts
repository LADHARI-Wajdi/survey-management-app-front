// core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

export interface Notification {
  action: any;
  id: string;
  type: NotificationType;
  message: string;
  autoClose?: boolean;
  timeout?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  private notificationId = 0;
  notifications$: any;

  constructor() { }

  // Observable que les composants peuvent souscrire
  onNotification(): Observable<Notification> {
    return this.notificationSubject.asObservable();
  }

  // Méthodes pour créer différents types de notifications
  success(message: string, autoClose = true, timeout = 5000): void {
    this.showNotification(NotificationType.SUCCESS, message, autoClose, timeout);
  }

  error(message: string, autoClose = true, timeout = 5000): void {
    this.showNotification(NotificationType.ERROR, message, autoClose, timeout);
  }

  info(message: string, autoClose = true, timeout = 5000): void {
    this.showNotification(NotificationType.INFO, message, autoClose, timeout);
  }

  warning(message: string, autoClose = true, timeout = 5000): void {
    this.showNotification(NotificationType.WARNING, message, autoClose, timeout);
  }

  // Méthode pour créer une notification
  private showNotification(type: NotificationType, message: string, autoClose: boolean, timeout: number): void {
    this.notificationId++;
    const id = `notification-${this.notificationId}`;
    
    this.notificationSubject.next({
      id,
      type,
      message,
      autoClose,
      timeout,
      action: undefined
    });
  }

  // Méthode pour fermer une notification spécifique
  removeNotification(id: string): void {
    // Cette méthode serait utilisée par un composant de notification
    // pour signaler la fermeture d'une notification
    console.log(`Closing notification: ${id}`);
  }
}