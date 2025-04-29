// src/app/features/survey-taking/components/survey-participant-view/survey-participant-view.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SurveyService } from '../../../survey-management/services/survey.service';
import { SurveyProgressService } from '../../services/survey-progress.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/authentication/services/auth.service';

import { QuestionResponseComponent } from '../question-response/question-response.component';
import { SurveyCompletionComponent } from '../survey-completion/survey-completion.component';

import { Survey } from '../../../../core/models/survey.model';
import { Question } from '../../../../core/models/question.model';
import { Response as SurveyResponse } from '../../../../core/models/response.model';

@Component({
  selector: 'app-survey-participant-view',
  templateUrl: './survey-participant-view.component.html',
  styleUrls: ['./survey-participant-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QuestionResponseComponent
]
})
export class SurveyParticipantViewComponent implements OnInit, OnDestroy {
  survey: Survey | null = null;
  questions: Question[] = [];
  currentQuestion: Question | null = null;
  currentQuestionIndex = 0;
  
  isLoading = true;
  hasError = false;
  errorMessage = '';
  
  surveyCompleted = false;
  progressPercentage = 0;
  
  private progressSubscription: Subscription | null = null;
  private responseSubscription: Subscription | null = null;
getResponse: any;
  surveyResponseService: any;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private progressService: SurveyProgressService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Get survey ID from route
    const surveyId = this.route.snapshot.paramMap.get('id');
    if (!surveyId) {
      this.setError('ID d\'enquête non valide');
      return;
    }
    
    // Load the survey
    this.loadSurvey(surveyId);
  }
  
  ngOnDestroy(): void {
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
    }
    if (this.responseSubscription) {
      this.responseSubscription.unsubscribe();
    }
  }
  
  /**
   * Load a survey by ID
   */
  private loadSurvey(surveyId: string): void {
    this.isLoading = true;
    
    // First check if user has already responded to this survey
    const currentUser = this.authService.currentUserValue;
    this.surveyResponseService.hasRespondedToSurvey(surveyId, currentUser?.id).subscribe(
      (      hasResponded: any) => {
        if (hasResponded) {
          this.notificationService.warning('Vous avez déjà répondu à cette enquête');
          
          // Show completion page
          this.survey = { id: surveyId } as Survey;
          this.surveyCompleted = true;
          this.isLoading = false;
          return;
        }
        
        // Load the survey
        this.surveyService.getSurveyById(surveyId).subscribe(
          survey => {
            this.survey = survey;
            
            // Check if survey is published
            if (survey.status !== 'published') {
              this.setError('Cette enquête n\'est pas disponible actuellement');
              return;
            }
            
            // Check if survey is expired
            if (survey.expirationDate && new Date(survey.expirationDate) < new Date()) {
              this.setError('Cette enquête a expiré et n\'est plus disponible');
              return;
            }
            
            // Load all questions from all sections
            this.loadQuestions(survey);
          },
          error => {
            this.setError('Erreur lors du chargement de l\'enquête');
            console.error('Error loading survey:', error);
          }
        );
      },
      (      error: any) => {
        console.error('Error checking response status:', error);
        // Continue loading the survey anyway
        this.loadSurveyMain(surveyId);
      }
    );
  }
  
  /**
   * Main survey loading logic (used as a fallback if hasResponded check fails)
   */
  private loadSurveyMain(surveyId: string): void {
    this.surveyService.getSurveyById(surveyId).subscribe(
      survey => {
        this.survey = survey;
        
        // Check if survey is published
        if (survey.status !== 'published') {
          this.setError('Cette enquête n\'est pas disponible actuellement');
          return;
        }
        
        // Load all questions from all sections
        this.loadQuestions(survey);
      },
      error => {
        this.setError('Erreur lors du chargement de l\'enquête');
        console.error('Error loading survey:', error);
      }
    );
  }
  
  /**
   * Load and organize questions from all sections
   */
  private loadQuestions(survey: Survey): void {
    const allQuestionIds: string[] = [];
    survey.sections.forEach(section => {
      allQuestionIds.push(...section.questions);
    });
    
    if (allQuestionIds.length === 0) {
      this.setError('Cette enquête ne contient aucune question');
      return;
    }
    
    // In a real app, you'd make an API call to get all questions
    // Here we'll simulate it for demonstration purposes
    this.simulateLoadQuestions(allQuestionIds).then(questions => {
      this.questions = questions;
      
      // Check if we have saved progress for this survey
      const savedProgress = this.progressService.loadProgressFromStorage(survey.id);
      
      // Initialize progress tracker
      this.progressService.initSurvey(survey, questions, savedProgress);
      
      // Subscribe to progress updates
      this.progressSubscription = this.progressService.progress$.subscribe(progress => {
        if (progress) {
          this.progressPercentage = progress.percentComplete;
          this.currentQuestionIndex = progress.currentQuestionIndex;
          this.currentQuestion = this.questions[this.currentQuestionIndex] || null;
        }
      });
      
      this.isLoading = false;
    }).catch(error => {
      this.setError('Erreur lors du chargement des questions');
      console.error('Error loading questions:', error);
    });
  }
  
  /**
   * Simulate loading questions (in a real app, this would be an API call)
   */
  private simulateLoadQuestions(questionIds: string[]): Promise<Question[]> {
    return new Promise<Question[]>(resolve => {
      // Simulated questions (in a real app, these would come from the API)
      const mockQuestions: Question[] = questionIds.map((id, index) => ({
        id,
        title: `Question ${index + 1}`,
        description: index % 2 === 0 ? `Description for question ${index + 1}` : undefined,
        type: this.getRandomQuestionType(index),
        isRequired: index % 3 !== 0, // Make some questions required
        order: index + 1,
        options: this.getMockOptions(index),
        skipped: false,
        maxRating: 5, // Default value for rating questions
        minRating: 1, // Default value for rating questions
        value: null // Default value for the question's response
      }));
      
      setTimeout(() => resolve(mockQuestions), 500); // Simulate network delay
    });
  }
  
  /**
   * Get a random question type for mock data
   */
  private getRandomQuestionType(index: number): any {
    const types = [
      'text_short',
      'text_long',
      'single_choice',
      'multiple_choice',
      'rating',
      'date',
      'numeric'
    ];
    // Use index modulo for deterministic "random" types
    return types[index % types.length];
  }
  
  /**
   * Get mock options for choice questions
   */
  private getMockOptions(index: number): any[] | undefined {
    if (['single_choice', 'multiple_choice'].includes(this.getRandomQuestionType(index))) {
      return [
        { id: `opt1_${index}`, text: `Option 1 for question ${index + 1}`, value: `opt1_${index}` },
        { id: `opt2_${index}`, text: `Option 2 for question ${index + 1}`, value: `opt2_${index}` },
        { id: `opt3_${index}`, text: `Option 3 for question ${index + 1}`, value: `opt3_${index}` }
      ];
    }
    return undefined;
  }
  
  /**
   * Handle question response changes
   */
  onResponseChange(response: any): void {
    if (!this.currentQuestion) return;
    
    this.progressService.saveResponse(this.currentQuestion.id, response);
  }
  
  /**
   * Navigate to the next question
   */
  nextQuestion(): void {
    // Validate current question if required
    if (this.currentQuestion?.isRequired && !this.progressService.isCurrentQuestionValid()) {
      this.notificationService.error('Veuillez répondre à cette question');
      return;
    }
    
    // Try to move to next question
    const hasNext = this.progressService.nextQuestion();
    
    // If no more questions, complete the survey
    if (!hasNext) {
      this.completeSurvey();
    }
  }
  
  /**
   * Navigate to the previous question
   */
  prevQuestion(): void {
    this.progressService.prevQuestion();
  }
  
  /**
   * Complete the survey and submit responses
   */
  completeSurvey(): void {
    // Check if all required questions have been answered
    if (!this.progressService.isComplete()) {
      this.notificationService.error('Veuillez répondre à toutes les questions obligatoires');
      return;
    }
    
    // Get all responses
    const responses = this.progressService.getAllResponses();
    
    // Build complete response object
    if (!this.survey) return;
    
    const surveyResponse: SurveyResponse = {
      id: '', // Will be generated on the server
      surveyId: this.survey.id,
      respondentId: this.authService.currentUserValue?.id, // Can be null for anonymous responses
      startTime: this.progressService.getProgress()?.startTime || new Date(),
      endTime: new Date(),
      completionStatus: 'complete',
      answers: Object.keys(responses).map(questionId => ({
        questionId,
        value: responses[questionId],
        skipped: responses[questionId] === null || responses[questionId] === undefined,
        timestamp: new Date()
      })),
      metadata: {
        timeSpent: this.progressService.getProgress()?.timeSpent || 0,
        device: this.detectDeviceType()
      }
    };
    
    this.isLoading = true;
    
    // Submit response
    this.surveyResponseService.submitResponse(surveyResponse).subscribe(
      (      response: any) => {
        // Mark as completed
        this.surveyCompleted = true;
        this.isLoading = false;
        
        // Mark as responded in session storage (for anonymous users)
        this.surveyResponseService.markSurveyAsResponded(this.survey!.id);
        
        // Clear saved progress
        this.progressService.clearProgress();
        
        this.notificationService.success('Enquête complétée avec succès !');
      },
      (      error: any) => {
        this.isLoading = false;
        this.notificationService.error('Erreur lors de la soumission de l\'enquête');
        console.error('Error submitting survey response:', error);
      }
    );
  }
  
  /**
   * Save the current survey progress without completing
   */
  saveDraft(): void {
    if (!this.survey) return;
    
    // Get all responses
    const responses = this.progressService.getAllResponses();
    
    // Build partial response object
    const partialResponse: SurveyResponse = {
      id: '', // Will be generated on the server
      surveyId: this.survey.id,
      respondentId: this.authService.currentUserValue?.id, // Can be null for anonymous responses
      startTime: this.progressService.getProgress()?.startTime || new Date(),
      completionStatus: 'partial',
      answers: Object.keys(responses).map(questionId => ({
        questionId,
        value: responses[questionId],
        skipped: responses[questionId] === null || responses[questionId] === undefined,
        timestamp: new Date()
      }))
    };
    
    this.isLoading = true;
    
    // Save partial response
    this.surveyResponseService.savePartialResponse(partialResponse).subscribe(
      (      response: any) => {
        this.isLoading = false;
        this.notificationService.success('Progrès enregistré !');
      },
      (      error: any) => {
        this.isLoading = false;
        this.notificationService.error('Erreur lors de l\'enregistrement du brouillon');
        console.error('Error saving draft response:', error);
      }
    );
  }
  
  /**
   * Set an error state
   */
  private setError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.isLoading = false;
  }
  
  /**
   * Detect device type for metadata
   */
  private detectDeviceType(): 'desktop' | 'tablet' | 'mobile' {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Check for mobile
    if (/android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent)) {
      // Check for tablet
      if (/ipad|tablet/.test(userAgent)) {
        return 'tablet';
      }
      return 'mobile';
    }
    
    return 'desktop';
  }
}