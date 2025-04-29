// shared/components/access-denied/access-denied.component.ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/authentication/services/auth.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink]
})
export class AccessDeniedComponent {
  userRoles: string[] = [];
  
  constructor(private authService: AuthService) {
    // Get user roles to display in the message
    const user = this.authService.currentUserValue;
    if (user) {
      this.userRoles = user.roles;
    }
  }
  
  goBack() {
    window.history.back();
  }
}