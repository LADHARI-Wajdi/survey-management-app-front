import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/authentication/services/auth.service';
import { UserRole } from '../../core/models/user.model';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  responsesLastMonth: number;
  averageResponseTime: number;
  completionRate: number;
}

interface RecentActivity {
  id: string;
  type:
    | 'user_registration'
    | 'survey_creation'
    | 'survey_response'
    | 'user_login';
  userId: string;
  userName: string;
  surveyId?: string;
  surveyTitle?: string;
  timestamp: Date;
  description: string;
}

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DateFormatPipe],
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalSurveys: 0,
    activeSurveys: 0,
    totalResponses: 0,
    responsesLastMonth: 0,
    averageResponseTime: 0,
    completionRate: 0,
  };

  recentActivity: RecentActivity[] = [];
  topSurveys: any[] = [];
  usersByRole: any[] = [];
  responsesByDevice: any[] = [];
  isLoading = false;

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Vérifier si l'utilisateur a le rôle admin
    this.authService.currentUser$.subscribe(user => {
      if (user && !user.roles.includes(UserRole.ADMIN)) {
        // Rediriger vers la page appropriée s'il n'a pas les droits
        this.authService.redirectByRole();
      } else {
        // Charger les données du tableau de bord
        this.loadDashboardData();
      }
    });
  }

  loadDashboardData(): void {
    this.isLoading = true;

    // In a real application, these would be actual API endpoints
    const statsRequest = this.http.get<DashboardStats>(
      '/api/admin/dashboard/stats'
    );
    const activityRequest = this.http.get<RecentActivity[]>(
      '/api/admin/dashboard/activity'
    );
    const topSurveysRequest = this.http.get<any[]>(
      '/api/admin/dashboard/top-surveys'
    );
    const usersByRoleRequest = this.http.get<any[]>(
      '/api/admin/dashboard/users-by-role'
    );
    const responsesByDeviceRequest = this.http.get<any[]>(
      '/api/admin/dashboard/responses-by-device'
    );

    forkJoin({
      stats: statsRequest,
      activity: activityRequest,
      topSurveys: topSurveysRequest,
      usersByRole: usersByRoleRequest,
      responsesByDevice: responsesByDeviceRequest,
    }).subscribe({
      next: (results) => {
        this.stats = results.stats;
        this.recentActivity = results.activity;
        this.topSurveys = results.topSurveys;
        this.usersByRole = results.usersByRole;
        this.responsesByDevice = results.responsesByDevice;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.isLoading = false;

        // For demo purposes, load mock data
        this.loadMockData();
      }
    });
  }

  /**
   * Load mock data for demonstration
   */
  private loadMockData(): void {
    // Mock statistics
    this.stats = {
      totalUsers: 876,
      activeUsers: 342,
      totalSurveys: 1254,
      activeSurveys: 378,
      totalResponses: 25689,
      responsesLastMonth: 4562,
      averageResponseTime: 3.5, // minutes
      completionRate: 78.5, // percentage
    };

    // Mock recent activity
    this.recentActivity = [
      {
        id: '1',
        type: 'user_registration',
        userId: 'u123',
        userName: 'Sophie Martin',
        timestamp: new Date('2023-03-20T14:32:15'),
        description: 'Nouveau compte créé',
      },
      {
        id: '2',
        type: 'survey_creation',
        userId: 'u456',
        userName: 'Thomas Dubois',
        surveyId: 's789',
        surveyTitle: 'Satisfaction des employés',
        timestamp: new Date('2023-03-20T13:15:27'),
        description: 'Nouvelle enquête créée',
      },
      {
        id: '3',
        type: 'survey_response',
        userId: 'u789',
        userName: 'Jean Dupont',
        surveyId: 's456',
        surveyTitle: 'Évaluation de produit',
        timestamp: new Date('2023-03-20T12:05:11'),
        description: 'Réponse soumise',
      },
      {
        id: '4',
        type: 'user_login',
        userId: 'u234',
        userName: 'Marie Lefebvre',
        timestamp: new Date('2023-03-20T11:42:53'),
        description: 'Connexion réussie',
      },
      {
        id: '5',
        type: 'survey_creation',
        userId: 'u567',
        userName: 'Pierre Richard',
        surveyId: 's123',
        surveyTitle: 'Sondage marketing',
        timestamp: new Date('2023-03-20T10:27:38'),
        description: 'Nouvelle enquête créée',
      },
    ];

    // Mock top surveys
    this.topSurveys = [
      {
        id: 's123',
        title: 'Sondage marketing',
        responses: 1245,
        completionRate: 82.3,
      },
      {
        id: 's456',
        title: 'Évaluation de produit',
        responses: 985,
        completionRate: 75.8,
      },
      {
        id: 's789',
        title: 'Satisfaction des employés',
        responses: 723,
        completionRate: 91.2,
      },
      {
        id: 's234',
        title: 'Feedback client',
        responses: 652,
        completionRate: 68.5,
      },
      {
        id: 's567',
        title: 'Étude de marché',
        responses: 589,
        completionRate: 72.1,
      },
    ];

    // Mock users by role
    this.usersByRole = [
      { role: 'admin', count: 15, percentage: 1.7 },
      { role: 'surveyor', count: 123, percentage: 14.0 },
      { role: 'analyst', count: 67, percentage: 7.6 },
      { role: 'participant', count: 671, percentage: 76.7 },
    ];

    // Mock responses by device
    this.responsesByDevice = [
      { device: 'desktop', count: 15245, percentage: 59.3 },
      { device: 'mobile', count: 8723, percentage: 34.0 },
      { device: 'tablet', count: 1721, percentage: 6.7 },
    ];
  }

  /**
   * Get CSS class for activity type
   */
  getActivityClass(type: string): string {
    switch (type) {
      case 'user_registration':
        return 'activity-registration';
      case 'survey_creation':
        return 'activity-creation';
      case 'survey_response':
        return 'activity-response';
      case 'user_login':
        return 'activity-login';
      default:
        return '';
    }
  }

  /**
   * Get icon for activity type
   */
  getActivityIcon(type: string): string {
    switch (type) {
      case 'user_registration':
        return 'fa-user-plus';
      case 'survey_creation':
        return 'fa-file-alt';
      case 'survey_response':
        return 'fa-reply';
      case 'user_login':
        return 'fa-sign-in-alt';
      default:
        return 'fa-circle';
    }
  }

  /**
   * Calculate growth percentage
   */
  calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  }

  /**
   * Refresh dashboard data
   */
  refreshData(): void {
    this.loadDashboardData();
  }
}