import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ChartOptions } from 'chart.js';

import { AnalyticsService } from '../../services/analytics.service';
import { SurveyService } from '../../../survey-management/services/survey.service';
import { ExportService } from '../../services/export.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Survey } from '../../../../core/models/survey.model';

@Component({
  selector: 'app-analytics-dashboard',
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss'],
})
export class AnalyticsDashboardComponent implements OnInit {
  surveys: Survey[] = [];
  selectedSurveyId: string = '';
  currentSurvey: Survey | null = null;
  selectedPeriod: string = 'month';
  responseType: string = 'all';
  analytics: any = null;
  recentResponses: any[] = [];
  isLoading: boolean = false;

  // Données pour les graphiques
  barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  barChartLabels: string[] = ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'];
  barChartLegend: boolean = false;
  barChartPlugins: any[] = [];
  barChartData: any[] = [
    {
      data: [0, 0, 0, 0, 0],
      backgroundColor: '#FF4081',
    },
  ];

  pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  constructor(
    private analyticsService: AnalyticsService,
    private surveyService: SurveyService,
    private exportService: ExportService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Obtenir la liste des enquêtes disponibles
    this.surveyService.getAllSurveys().subscribe(
      (surveys) => {
        this.surveys = surveys;

        // Vérifier si une enquête est spécifiée dans l'URL
        this.route.params.subscribe((params) => {
          if (params['id']) {
            this.selectedSurveyId = params['id'];
            this.loadSurveyAnalytics();
          } else {
            // Charger des statistiques générales si aucune enquête n'est sélectionnée
            this.loadGeneralAnalytics();
          }
        });
      },
      (error) => {
        this.notificationService.error(
          'Erreur lors du chargement des enquêtes'
        );
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  onSurveyChange(): void {
    if (this.selectedSurveyId) {
      this.loadSurveyAnalytics();
      // Mettre à jour l'URL
      this.router.navigate(['/analytics/survey', this.selectedSurveyId]);
    } else {
      this.loadGeneralAnalytics();
      this.router.navigate(['/analytics']);
    }
  }

  onPeriodChange(): void {
    if (this.selectedSurveyId) {
      this.loadSurveyAnalytics();
    } else {
      this.loadGeneralAnalytics();
    }
  }

  onResponseTypeChange(): void {
    // Implémentation du filtrage par type de réponse
    this.notificationService.info('Filtrage par type de réponse à implémenter');
  }

  exportData(): void {
    if (!this.selectedSurveyId) {
      this.notificationService.error(
        'Veuillez sélectionner une enquête pour exporter les données'
      );
      return;
    }

    this.analyticsService
      .exportSurveyData(this.selectedSurveyId, 'csv')
      .subscribe(
        (blob) => {
          this.exportService.downloadFile(
            blob,
            `${this.currentSurvey?.title || 'survey'}_data.csv`
          );
          this.notificationService.success('Données exportées avec succès');
        },
        (error) => {
          this.notificationService.error(
            "Erreur lors de l'exportation des données"
          );
          console.error(error);
        }
      );
  }

  goToDistribution(): void {
    if (this.selectedSurveyId) {
      this.router.navigate(['/distribution', this.selectedSurveyId]);
    } else {
      this.router.navigate(['/surveys']);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }

  getRatingClass(rating: number): string {
    if (rating >= 4) return 'rating-high';
    if (rating >= 3) return 'rating-medium';
    return 'rating-low';
  }

  // Méthodes pour les graphiques de questions
  getPieData(question: any): number[] {
    return question.optionCounts?.map((option: any) => option.count) || [];
  }

  getPieLabels(question: any): string[] {
    return question.optionCounts?.map((option: any) => option.optionText) || [];
  }

  getBarData(question: any): any[] {
    return [
      {
        data: question.optionCounts?.map((option: any) => option.count) || [],
        backgroundColor: '#3F51B5',
      },
    ];
  }

  getBarLabels(question: any): string[] {
    return question.optionCounts?.map((option: any) => option.optionText) || [];
  }

  getWordSize(frequency: number): number {
    // Taille de police basée sur la fréquence du mot
    const minSize = 12;
    const maxSize = 24;
    const maxFrequency = 50; // Valeur arbitraire pour la démonstration

    return Math.max(
      minSize,
      Math.min(
        maxSize,
        minSize + (frequency / maxFrequency) * (maxSize - minSize)
      )
    );
  }

  private loadSurveyAnalytics(): void {
    this.isLoading = true;

    // Obtenir les détails de l'enquête sélectionnée
    this.surveyService.getSurveyById(this.selectedSurveyId).subscribe(
      (survey) => {
        this.currentSurvey = survey;

        // Obtenir les analyses pour cette enquête
        this.analyticsService
          .getSurveyAnalytics(this.selectedSurveyId, this.selectedPeriod)
          .subscribe(
            (data) => {
              this.analytics = data;

              // Mettre à jour les données du graphique en barre
              if (data.questions && data.questions.length > 0) {
                const ratingQuestion = data.questions.find(
                  (q: any) => q.type === 'rating'
                );
                if (ratingQuestion && ratingQuestion.ratingDistribution) {
                  this.barChartData = [
                    {
                      data: ratingQuestion.ratingDistribution.map(
                        (r: any) => r.percentage
                      ),
                      backgroundColor: '#FF4081',
                    },
                  ];
                }
              }

              // Obtenir les réponses récentes
              this.analyticsService
                .getRecentResponses(this.selectedSurveyId)
                .subscribe(
                  (responses) => {
                    this.recentResponses = responses;
                    this.isLoading = false;
                  },
                  (error) => {
                    console.error('Error fetching recent responses', error);
                    this.recentResponses = [];
                    this.isLoading = false;
                  }
                );
            },
            (error) => {
              this.notificationService.error(
                'Erreur lors du chargement des analyses'
              );
              console.error(error);
              this.isLoading = false;
            }
          );
      },
      (error) => {
        this.notificationService.error(
          "Erreur lors du chargement des détails de l'enquête"
        );
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  private loadGeneralAnalytics(): void {
    this.isLoading = true;

    this.analyticsService.getDashboardStats().subscribe(
      (data) => {
        // Pour la démonstration, utilisons un format simplifié
        this.analytics = {
          totalResponses: data.totalResponses,
          completionRate: data.averageCompletionRate,
          averageRating: 4.0, // Valeur fictive
          averageTime: 180, // Valeur fictive
          questions: [], // Pas de questions spécifiques pour les statistiques générales
        };

        this.currentSurvey = null;
        this.recentResponses = []; // Pas de réponses récentes pour les statistiques générales
        this.isLoading = false;
      },
      (error) => {
        this.notificationService.error(
          'Erreur lors du chargement des statistiques générales'
        );
        console.error(error);
        this.isLoading = false;
      }
    );
  }
}
