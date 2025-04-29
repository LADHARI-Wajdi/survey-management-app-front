// layouts/auth-layout/auth-layout.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/authentication/services/auth.service';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class AuthLayoutComponent implements OnInit {
  currentYear = new Date().getFullYear();

  constructor(private authService: AuthService, private router: Router) {
    // If user is already logged in, redirect to home
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {}
}
