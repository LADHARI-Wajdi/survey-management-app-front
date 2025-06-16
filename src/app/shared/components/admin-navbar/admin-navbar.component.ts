import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AdminNavbarComponent {
  @Input() currentUser: any;
  @Input() pageTitle: string = '';
  @Input() isMenuCollapsed: boolean = false;
  @Output() menuToggle = new EventEmitter<void>();
  @Output() logoutEvent = new EventEmitter<void>();

  get activeRoute(): string {
    return this.router.url;
  }

  constructor(private router: Router) {}

  toggleMenu() {
    this.menuToggle.emit();
  }

  logout() {
    this.logoutEvent.emit();
  }
} 