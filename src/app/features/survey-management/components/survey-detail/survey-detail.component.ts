import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SurveyService } from '../../services/survey.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Survey, SurveyStatus, SurveySettings, SurveySection } from '../../../../core/models/survey.model';
import { Question, QuestionType } from '../../../../core/models/question.model';
import { QuestionTypeLabelPipe } from '../../../../core/pipes/question-type-label.pipe';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    QuestionTypeLabelPipe
  ]
})
export class SurveyDetailComponent implements OnInit {
  SurveyStatus = SurveyStatus;
  survey: Survey | null = null;
  totalQuestions = 0;
  responseCount = 0;
  isLoading = true;
  error: string | null = null;
  settings: SurveySettings = {
    allowAnonymous: false,
    showProgressBar: false,
    allowIncomplete: false,
    shuffleQuestions: false,
    notifyOnResponse: false
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const surveyId = this.route.snapshot.paramMap.get('id');
    if (surveyId) {
      this.loadSurvey(surveyId);
    } else {
      this.isLoading = false;
    }
  }

  loadSurvey(id: string): void {
    this.isLoading = true;
    this.surveyService.getSurveyById(id).subscribe({
      next: (survey) => {
        this.survey = survey;
        this.survey.creationDate = new Date(survey['createdAt']);
        this.survey.expirationDate = survey['endDate'] ? new Date(survey['endDate']) : undefined;
        this.totalQuestions = survey['questions']?.length || 0;
        this.survey.status = survey.status as SurveyStatus;
        this.responseCount = Math.floor(Math.random() * 100); // Replace with real logic later
        this.settings = survey.settings || this.settings;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement de l\'enquête';
        this.isLoading = false;
        console.error('Error loading survey:', error);
      }
    });
  }

  getQuestion(section: SurveySection, questionId: string): Question | undefined {
    return section.questions.find(q => q.id === questionId);
  }

  getSectionQuestions(section: SurveySection): Question[] {
    return section.questions;
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  toggleSurveyStatus(): void {
    if (!this.survey) return;

    const newStatus = this.survey.status === SurveyStatus.PUBLISHED
      ? SurveyStatus.CLOSED
      : SurveyStatus.PUBLISHED;

    this.surveyService.updateSurvey(this.survey.id, {
      ...this.survey,
      status: newStatus
    }).subscribe(
      (updatedSurvey) => {
        this.survey = updatedSurvey;
        this.survey.status = newStatus;
        const statusAction = newStatus === SurveyStatus.PUBLISHED ? 'publiée' : 'clôturée';
        this.notificationService.success(`Enquête ${statusAction} avec succès`);
      },
      (error) => {
        console.error('Error updating survey status', error);
        this.notificationService.error(`Erreur lors de la modification du statut de l'enquête`);
      }
    );
  }

  duplicateSurvey(): void {
    if (!this.survey) return;

    this.surveyService.duplicateSurvey(this.survey.id, `${this.survey.title} (copie)`).subscribe(
      (newSurvey) => {
        this.notificationService.success(`Enquête dupliquée avec succès`);
        this.router.navigate(['/surveys', newSurvey.id]);
      },
      (error) => {
        console.error('Error duplicating survey', error);
        this.notificationService.error(`Erreur lors de la duplication de l'enquête`);
      }
    );
  }

  deleteSurvey(): void {
    if (!this.survey) return;

    const confirmDelete = confirm(`Êtes-vous sûr de vouloir supprimer l'enquête "${this.survey.title}" ? Cette action est irréversible.`);
    if (confirmDelete) {
      this.surveyService.deleteSurvey(this.survey.id).subscribe(
        () => {
          this.notificationService.success(`Enquête supprimée avec succès`);
          this.router.navigate(['/surveys']);
        },
        (error) => {
          console.error('Error deleting survey', error);
          this.notificationService.error(`Erreur lors de la suppression de l'enquête`);
        }
      );
    }
  }

  getQuestionNumber(sectionIndex: number, questionIndex: number): number {
    let questionCount = 0;
    for (let i = 0; i < sectionIndex; i++) {
      questionCount += this.survey?.sections[i]?.questions.length || 0;
    }
    return questionCount + questionIndex + 1;
  }
}
