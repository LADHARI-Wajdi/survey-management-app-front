// src/app/features/participant-dashboard/components/participant-dashboard/participant-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { User, UserRole } from '../../../../core/models/user.model';
import { ParticipantDashboardService } from '../../services/participant-dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participant-dashboard',
  templateUrl: './participant-dashboard.component.html',
  styleUrls: ['./participant-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class ParticipantDashboardComponent implements OnInit {
  currentUser: User | null = null;
  dashboardStats = {
    availableSurveys: 0,
    completedSurveys: 0,
    totalResponses: 0,
    avgCompletionTime: 0
  };
  isLoading = true;
  
  constructor(
    private dashboardService: ParticipantDashboardService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Récupérer l'utilisateur actuel
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      
      // Vérifier si l'utilisateur a les droits nécessaires
      if (user) {
        if (this.hasRequiredRole(user)) {
          this.loadDashboardData();
        } else {
          // Rediriger vers la page appropriée s'il n'a pas les droits
          this.authService.redirectByRole();
        }
      }
    });
  }

  // Vérifier si l'utilisateur a le rôle requis
  private hasRequiredRole(user: User): boolean {
    return user.roles.includes(UserRole.PARTICIPANT) || user.roles.includes(UserRole.ADMIN);
  }

  /**
   * Chargement des données du tableau de bord
   */
  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getParticipantStats().subscribe({
      next: (stats) => {
        this.dashboardStats = stats;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des statistiques', error);
        this.isLoading = false;
        // En cas d'erreur, charger des données mock pour la démonstration
        this.loadMockData();
      }
    });
  }

  /**
   * Formater le temps moyen de complétion
   */
  formatAvgTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }

  /**
   * Charge des données fictives en cas d'erreur ou pour la démonstration
   */
  private loadMockData(): void {
    this.dashboardStats = {
      availableSurveys: 3,
      completedSurveys: 7,
      totalResponses: 15,
      avgCompletionTime: 187 // 3 minutes et 7 secondes
    };
    this.isLoading = false;
  }
}