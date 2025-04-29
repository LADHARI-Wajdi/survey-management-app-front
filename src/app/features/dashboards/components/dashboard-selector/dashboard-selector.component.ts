// features/dashboards/components/dashboard-selector/dashboard-selector.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { UserRole } from '../../../../core/models/user.model';

@Component({
  selector: 'app-dashboard-selector',
  templateUrl: './dashboard-selector.component.html',
  styleUrls: ['./dashboard-selector.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DashboardSelectorComponent implements OnInit {
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtenir l'utilisateur actuel
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Rediriger en fonction du rôle de l'utilisateur
        if (user.roles.includes(UserRole.ADMIN)) {
          this.router.navigate(['/admin/dashboard']);
        } else if (user.roles.includes(UserRole.INVESTIGATOR)) {
          this.router.navigate(['/investigator/dashboard']);
        } else if (user.roles.includes(UserRole.PARTICIPANT)) {
          this.router.navigate(['/participant/dashboard']);
        } else {
          // Si aucun rôle reconnu, rediriger vers la page d'accueil
          this.router.navigate(['/']);
        }
      } else {
        // Si aucun utilisateur n'est connecté, rediriger vers la page de connexion
        this.router.navigate(['/auth/login']);
      }
    });
  }
}