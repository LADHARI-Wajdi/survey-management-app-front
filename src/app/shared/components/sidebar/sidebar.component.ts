import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User, UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Input() currentUser: User | null = null;
  @Input() activeRoute = '';
  @Input() appTitle = 'SurveyApp';
  @Input() isAdmin = false;
  @Input() menuItems: Array<{
    path: string;
    label: string;
    icon: string;
    roles?: UserRole[];
    isExternal?: boolean;
    section?: string;
  }> = [];

  @Output() toggleCollapse = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  UserRole = UserRole; // Make UserRole enum available in template

  getUserRoleDisplay(): string {
    if (!this.currentUser) return '';
    
    if (this.currentUser.roles.includes(UserRole.ADMIN)) {
      return 'Administrateur';
    } else if (this.currentUser.roles.includes(UserRole.INVESTIGATOR)) {
      return 'Enquêteur';
    } else {
      return 'Participant';
    }
  }

  hasRole(role: UserRole): boolean {
    return this.currentUser?.roles.includes(role) ?? false;
  }

  getMenuItemsBySection(): { [key: string]: any[] } {
    const sections: { [key: string]: any[] } = {};
    
    this.menuItems.forEach(item => {
      const section = item.section || 'default';
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push(item);
    });
    
    return sections;
  }
}
