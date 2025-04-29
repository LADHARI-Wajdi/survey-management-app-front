// features/survey-management/components/survey-detail/survey-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SurveyService } from '../../services/survey.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Survey, SurveyStatus } from '../../../../core/models/survey.model';
import { Question, QuestionType } from '../../../../core/models/question.model';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SurveyDetailComponent implements OnInit {
  survey: Survey | null = null;
  questions: { [id: string]: Question } = {};
  totalQuestions = 0;
  responseCount = 0;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private notificationService: NotificationService
  ) { }

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
    this.surveyService.getSurveyById(id).subscribe(
      (survey) => {
        this.survey = survey;
        
        // Count total questions across all sections
        this.totalQuestions = survey.sections.reduce((total, section) => 
          total + section.questions.length, 0);
        
        // Load all questions for this survey
        this.loadQuestions(survey);
        
        // For demo purposes, set a random response count
        this.responseCount = Math.floor(Math.random() * 100);
        
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading survey', error);
        this.notificationService.error('Erreur lors du chargement de l\'enquête');
        this.isLoading = false;
      }
    );
  }

  loadQuestions(survey: Survey): void {
    // In a real application, we would fetch all questions from the backend
    // For now, let's create some mock questions
    
    // Collect all question IDs from all sections
    const questionIds: string[] = [];
    survey.sections.forEach(section => {
      questionIds.push(...section.questions);
    });
    
    // Create mock questions for each ID
    questionIds.forEach((id, index) => {
      const questionType = this.getRandomQuestionType();
      
      this.questions[id] = {
        id: id,
        title: `Question ${index + 1}`,
        description: index % 3 === 0 ? `Description de la question ${index + 1}` : undefined,
        type: questionType,
        isRequired: index % 2 === 0,
        order: index + 1,
        options: this.getOptionsForType(questionType, index),
        value: null,
        maxRating: 5,
        minRating: 1,
        skipped: false, // Added the 'skipped' property
      };
    });
  }

  getRandomQuestionType(): QuestionType {
    const types = [
      QuestionType.TEXT_SHORT,
      QuestionType.TEXT_LONG,
      QuestionType.SINGLE_CHOICE,
      QuestionType.MULTIPLE_CHOICE,
      QuestionType.RATING,
      QuestionType.DATE,
      QuestionType.FILE
    ];
    
    return types[Math.floor(Math.random() * types.length)];
  }

  getOptionsForType(type: QuestionType, index: number): any[] | undefined {
    if (type === QuestionType.SINGLE_CHOICE || type === QuestionType.MULTIPLE_CHOICE) {
      return [
        { id: `opt1_${index}`, text: 'Option 1', value: 'opt1' },
        { id: `opt2_${index}`, text: 'Option 2', value: 'opt2' },
        { id: `opt3_${index}`, text: 'Option 3', value: 'opt3' },
        { id: `opt4_${index}`, text: 'Option 4', value: 'opt4' }
      ];
    }
    
    return undefined;
  }

  getQuestion(id: string): Question | undefined {
    return this.questions[id];
  }

  getQuestionNumber(sectionIndex: number, questionIndex: number): number {
    let questionNumber = questionIndex + 1;
    
    // If there are multiple sections, we need to add the number of questions in previous sections
    if (this.survey && sectionIndex > 0) {
      for (let i = 0; i < sectionIndex; i++) {
        questionNumber += this.survey.sections[i].questions.length;
      }
    }
    
    return questionNumber;
  }

  getQuestionTypeLabel(type: string): string {
    switch (type) {
      case QuestionType.TEXT_SHORT:
        return 'Réponse courte';
      case QuestionType.TEXT_LONG:
        return 'Réponse longue';
      case QuestionType.SINGLE_CHOICE:
        return 'Choix unique';
      case QuestionType.MULTIPLE_CHOICE:
        return 'Choix multiple';
      case QuestionType.RATING:
        return 'Évaluation';
      case QuestionType.DATE:
        return 'Date';
      case QuestionType.FILE:
        return 'Fichier';
      case QuestionType.MATRIX:
        return 'Matrice';
      case QuestionType.RANKING:
        return 'Classement';
      case QuestionType.NUMERIC:
        return 'Numérique';
      default:
        return type;
    }
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

  toggleSurveyStatus(): void {
    if (!this.survey) return;
    
    const newStatus = this.survey.status === SurveyStatus.PUBLISHED ? 
      SurveyStatus.CLOSED : SurveyStatus.PUBLISHED;
    
    // Update the survey status
    this.surveyService.updateSurvey(this.survey.id, { ...this.survey, status: newStatus }).subscribe(
      (updatedSurvey) => {
        this.survey = updatedSurvey;
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
    
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'enquête "${this.survey.title}" ? Cette action est irréversible.`)) {
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
}