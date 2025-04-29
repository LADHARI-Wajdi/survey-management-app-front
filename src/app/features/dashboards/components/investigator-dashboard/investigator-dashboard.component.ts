// features/dashboards/components/investigator-dashboard/investigator-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/authentication/services/auth.service';
import { User, UserRole } from '../../../../core/models/user.model';

interface SurveyStats {
  id: string;
  title: string;
  responses: number;
  completionRate: number;
  status: 'draft' | 'published' | 'closed';
  creationDate: Date;
}

@Component({
  selector: 'app-investigator-dashboard',
  templateUrl: './investigator-dashboard.component.html',
  styleUrls: ['./investigator-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule]
})
export class InvestigatorDashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentSurveys: SurveyStats[] = [];
  stats = {
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
    averageCompletionRate: 0,
    surveysTrend: [0, 0, 0, 0, 0, 0, 0], // Données pour le graphique de tendance (7 derniers jours)
    responsesTrend: [0, 0, 0, 0, 0, 0, 0] // Données pour le graphique de tendance (7 derniers jours)
  };
  recentActivity: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Récupérer l'utilisateur actuel
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;

      // Vérifier si l'utilisateur a les droits nécessaires
      if (user && !this.hasRequiredRole(user)) {
        // Rediriger vers la page appropriée s'il n'a pas les droits
        this.authService.redirectByRole();
      }
    });

    // En situation réelle, on récupérerait ces données depuis un service
    this.loadMockData();
  }

  // Vérifier si l'utilisateur a le rôle requis
  private hasRequiredRole(user: User): boolean {
    return user.roles.includes(UserRole.INVESTIGATOR) || user.roles.includes(UserRole.ADMIN);
  }

  loadMockData(): void {
    // Exemple de données pour le tableau de bord des investigateurs
    this.stats = {
      totalSurveys: 15,
      activeSurveys: 6,
      totalResponses: 784,
      averageCompletionRate: 68,
      surveysTrend: [2, 3, 1, 2, 3, 2, 2], // 7 derniers jours
      responsesTrend: [25, 40, 35, 50, 80, 65, 45] // 7 derniers jours
    };

    this.recentSurveys = [
      {
        id: 's1',
        title: 'Enquête sur la satisfaction des clients',
        responses: 132,
        completionRate: 78,
        status: 'published',
        creationDate: new Date(new Date().setDate(new Date().getDate() - 10))
      },
      {
        id: 's2',
        title: 'Étude de marché produits bio',
        responses: 201,
        completionRate: 92,
        status: 'published',
        creationDate: new Date(new Date().setDate(new Date().getDate() - 15))
      },
      {
        id: 's3',
        title: 'Feedback sur notre nouveau site web',
        responses: 85,
        completionRate: 61,
        status: 'published',
        creationDate: new Date(new Date().setDate(new Date().getDate() - 8))
      },
      {
        id: 's4',
        title: 'Évaluation des services client',
        responses: 0,
        completionRate: 0,
        status: 'draft',
        creationDate: new Date(new Date().setDate(new Date().getDate() - 2))
      },
      {
        id: 's5',
        title: 'Sondage interne employés',
        responses: 47,
        completionRate: 73,
        status: 'closed',
        creationDate: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    ];

    this.recentActivity = [
      {
        type: 'response',
        message: 'Nouvelle réponse à "Enquête sur la satisfaction des clients"',
        time: '5 minutes ago'
      },
      {
        type: 'survey',
        message: 'L\'enquête "Feedback sur notre nouveau site web" a reçu 10 nouvelles réponses',
        time: '2 heures ago'
      },
      {
        type: 'notification',
        message: 'Rappel: 3 enquêtes en cours avec une date d\'expiration proche',
        time: '5 heures ago'
      },
      {
        type: 'achievement',
        message: 'Vous avez atteint 100 réponses pour "Étude de marché produits bio"',
        time: '1 jour ago'
      }
    ];
  }

  getSurveyStatusClass(status: string): string {
    switch (status) {
      case 'draft': return 'status-draft';
      case 'published': return 'status-published';
      case 'closed': return 'status-closed';
      default: return '';
    }
  }

  getSurveyStatusLabel(status: string): string {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'published': return 'Publié';
      case 'closed': return 'Fermé';
      default: return status;
    }
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'response': return 'fa-reply';
      case 'survey': return 'fa-poll';
      case 'notification': return 'fa-bell';
      case 'achievement': return 'fa-trophy';
      default: return 'fa-info-circle';
    }
  }

  editSurvey(id: string): void {
    console.log(`Éditer l'enquête: ${id}`);
    // Dans une application réelle, on redirigerait vers la page d'édition
    this.router.navigate(['/surveys/edit', id]);
  }

  viewResults(id: string): void {
    console.log(`Voir les résultats: ${id}`);
    // Dans une application réelle, on redirigerait vers la page des résultats
    this.router.navigate(['/analytics/survey', id]);
  }

  distributeSurvey(id: string): void {
    console.log(`Distribuer l'enquête: ${id}`);
    // Dans une application réelle, on redirigerait vers la page de distribution
    this.router.navigate(['/distribution', id]);
  }

  createNewSurvey(): void {
    console.log('Créer une nouvelle enquête');
    // Dans une application réelle, on redirigerait vers la page de création
    this.router.navigate(['/surveys/create']);
  }
}