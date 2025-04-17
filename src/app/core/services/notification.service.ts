// core/services/notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  timeout?: number;
  timestamp: Date;
  action?: {
    text: string;
    callback: () => void;
  };
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public readonly notifications$: Observable<Notification[]> =
    this.notificationsSubject.asObservable();

  constructor() {}

  // Helper methods for different notification types
  success(
    message: string,
    timeout: number = 5000,
    action?: { text: string; callback: () => void }
  ): void {
    this.addNotification({
      message,
      type: NotificationType.SUCCESS,
      timeout,
      action,
    });
  }

  error(
    message: string,
    timeout: number = 0,
    action?: { text: string; callback: () => void }
  ): void {
    this.addNotification({
      message,
      type: NotificationType.ERROR,
      timeout,
      action,
    });
  }

  warning(
    message: string,
    timeout: number = 7000,
    action?: { text: string; callback: () => void }
  ): void {
    this.addNotification({
      message,
      type: NotificationType.WARNING,
      timeout,
      action,
    });
  }

  info(
    message: string,
    timeout: number = 5000,
    action?: { text: string; callback: () => void }
  ): void {
    this.addNotification({
      message,
      type: NotificationType.INFO,
      timeout,
      action,
    });
  }

  // Add a new notification
  private addNotification(
    notification: Omit<Notification, 'id' | 'timestamp'>
  ): void {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto-remove notification after timeout if specified
    if (notification.timeout && notification.timeout > 0) {
      setTimeout(() => {
        this.removeNotification(id);
      }, notification.timeout);
    }
  }

  // Remove a notification by id
  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(
      currentNotifications.filter((notification) => notification.id !== id)
    );
  }

  // Clear all notifications
  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  // Generate a unique ID for notifications
  private generateId(): string {
    return (
      'notification-' +
      new Date().getTime() +
      '-' +
      Math.floor(Math.random() * 1000)
    );
  }
}
