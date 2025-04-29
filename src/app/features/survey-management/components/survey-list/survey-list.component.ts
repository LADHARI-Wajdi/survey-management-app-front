// features/survey-management/components/survey-list/survey-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SurveyService } from '../../services/survey.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Survey, SurveyStatus } from '../../../../core/models/survey.model';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TruncatePipe
  ]
})
export class SurveyListComponent implements OnInit {
  surveys: Survey[] = [];
  filteredSurveys: Survey[] = [];
  isLoading = true;
  
  // Filter options
  searchTerm = '';
  statusFilter = 'all';
  sortOption = 'recent';

  constructor(
    private surveyService: SurveyService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.isLoading = true;
    this.surveyService.getAllSurveys().subscribe(
      (surveys) => {
        this.surveys = surveys;
        
        // Enhance surveys with additional properties for display
        this.enhanceSurveys();
        
        this.applyFilter();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading surveys', error);
        this.notificationService.error('Erreur lors du chargement des enquêtes');
        this.isLoading = false;
      }
    );
  }

  enhanceSurveys(): void {
    // Add mock response counts for demo purposes
    // In a real app, this data would come from the backend
    this.surveys.forEach(survey => {
      // Add random response count for demo
      (survey as any).responseCount = Math.floor(Math.random() * 100);
    });
  }

  applyFilter(): void {
    // First filter by status
    let result = this.surveys;
    
    if (this.statusFilter !== 'all') {
      result = result.filter(survey => survey.status === this.statusFilter);
    }
    
    // Then filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(survey => 
        survey.title.toLowerCase().includes(term) || 
        (survey.description && survey.description.toLowerCase().includes(term))
      );
    }
    
    // Finally sort
    switch (this.sortOption) {
      case 'recent':
        result.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'responses':
        result.sort((a, b) => ((b as any).responseCount || 0) - ((a as any).responseCount || 0));
        break;
    }
    
    this.filteredSurveys = result;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'all';
    this.sortOption = 'recent';
    this.applyFilter();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case SurveyStatus.DRAFT:
        return 'status-draft';
      case SurveyStatus.PUBLISHED:
        return 'status-published';
      case SurveyStatus.CLOSED:
        return 'status-closed';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case SurveyStatus.DRAFT:
        return 'Brouillon';
      case SurveyStatus.PUBLISHED:
        return 'Publiée';
      case SurveyStatus.CLOSED:
        return 'Clôturée';
      default:
        return status;
    }
  }

  deleteSurvey(survey: Survey): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'enquête "${survey.title}" ?`)) {
      this.surveyService.deleteSurvey(survey.id).subscribe(
        () => {
          this.notificationService.success(`Enquête "${survey.title}" supprimée avec succès`);
          this.surveys = this.surveys.filter(s => s.id !== survey.id);
          this.applyFilter();
        },
        (error) => {
          console.error('Error deleting survey', error);
          this.notificationService.error(`Erreur lors de la suppression de l'enquête`);
        }
      );
    }
  }

  duplicateSurvey(survey: Survey): void {
    this.surveyService.duplicateSurvey(survey.id, `${survey.title} (copie)`).subscribe(
      (newSurvey) => {
        this.notificationService.success(`Enquête "${survey.title}" dupliquée avec succès`);
        this.surveys.push(newSurvey);
        this.applyFilter();
      },
      (error) => {
        console.error('Error duplicating survey', error);
        this.notificationService.error(`Erreur lors de la duplication de l'enquête`);
      }
    );
  }
}