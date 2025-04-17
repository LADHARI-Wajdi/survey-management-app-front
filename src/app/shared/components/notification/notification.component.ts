// shared/components/notification/notification.component.ts
import { Component, OnInit } from '@angular/core';
import {
  NotificationService,
  Notification,
  NotificationType,
} from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  notifications: Notification[] = [];

  // For template usage
  NotificationType = NotificationType;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe((notifications) => {
      this.notifications = notifications;
    });
  }

  /**
   * Close a notification
   */
  closeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  /**
   * Execute an action if provided
   */
  executeAction(notification: Notification): void {
    if (notification.action && notification.action.callback) {
      notification.action.callback();
    }
    this.closeNotification(notification.id);
  }

  /**
   * Get the icon for a notification type
   */
  getIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'fa-check-circle';
      case NotificationType.ERROR:
        return 'fa-exclamation-circle';
      case NotificationType.WARNING:
        return 'fa-exclamation-triangle';
      case NotificationType.INFO:
        return 'fa-info-circle';
      default:
        return 'fa-bell';
    }
  }
}
