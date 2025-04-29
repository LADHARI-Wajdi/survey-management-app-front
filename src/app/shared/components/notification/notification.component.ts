// shared/components/notification/notification.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription | null = null;

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.subscription = this.notificationService.notifications$.subscribe((notification: Notification) => {
      this.notifications.push(notification);
      
      if (notification.autoClose) {
        setTimeout(() => {
          this.close(notification);
        }, notification.timeout || 5000);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  close(notification: Notification): void {
    this.notifications = this.notifications.filter(n => n.id !== notification.id);
  }

  onActionClick(notification: Notification): void {
    if (notification.action && notification.action.callback) {
      notification.action.callback();
    }
    this.close(notification);
  }
}