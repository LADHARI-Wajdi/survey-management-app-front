// src/app/features/survey-taking/services/survey-progress.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Survey } from '../../../core/models/survey.model';
import { Question } from '../../../core/models/question.model';

interface SurveyProgress {
  currentSectionIndex: number;
  currentQuestionIndex: number;
  totalSections: number;
  totalQuestions: number;
  percentComplete: number;
  responses: { [questionId: string]: any };
  timeSpent: number; // In seconds
  startTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyProgressService {
  private progressSubject = new BehaviorSubject<SurveyProgress | null>(null);
  public readonly progress$ = this.progressSubject.asObservable();
  
  private survey: Survey | null = null;
  private questions: Question[] = [];
  private timer: any;
  
  constructor() { }
  
  /**
   * Initialize a new survey progress tracker
   * @param survey The survey being taken
   * @param questions All questions in the survey
   * @param storedProgress Optional stored progress to resume
   */
  initSurvey(survey: Survey, questions: Question[], storedProgress?: any): void {
    this.survey = survey;
    this.questions = questions;
    
    const progress: SurveyProgress = storedProgress || {
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      totalSections: survey.sections.length,
      totalQuestions: questions.length,
      percentComplete: 0,
      responses: {},
      timeSpent: 0,
      startTime: new Date()
    };
    
    this.progressSubject.next(progress);
    this.startTimer();
  }
  
  /**
   * Get the current progress
   */
  getProgress(): SurveyProgress | null {
    return this.progressSubject.value;
  }
  
  /**
   * Get the current question
   */
  getCurrentQuestion(): Question | null {
    const progress = this.progressSubject.value;
    if (!progress || !this.questions.length) return null;
    
    return this.questions[progress.currentQuestionIndex] || null;
  }
  
  /**
   * Get the response for a specific question
   * @param questionId ID of the question
   */
  getResponse(questionId: string): any {
    const progress = this.progressSubject.value;
    if (!progress) return null;
    
    return progress.responses[questionId];
  }
  
  /**
   * Save a response for a question
   * @param questionId ID of the question
   * @param value Response value
   */
  saveResponse(questionId: string, value: any): void {
    const progress = this.progressSubject.value;
    if (!progress) return;
    
    const updatedResponses = { ...progress.responses, [questionId]: value };
    const answeredQuestions = Object.keys(updatedResponses).length;
    const percentComplete = Math.floor((answeredQuestions / progress.totalQuestions) * 100);
    
    this.progressSubject.next({
      ...progress,
      responses: updatedResponses,
      percentComplete
    });
    
    // Save progress to localStorage
    this.saveProgressToStorage();
  }
  
  /**
   * Move to the next question
   * @returns Boolean indicating if there are more questions
   */
  nextQuestion(): boolean {
    const progress = this.progressSubject.value;
    if (!progress || !this.survey) return false;
    
    const currentSection = this.survey.sections[progress.currentSectionIndex];
    const currentSectionQuestions = currentSection?.questions || [];
    
    // If we're at the end of the current section's questions
    if (progress.currentQuestionIndex >= this.questions.length - 1) {
      return false; // No more questions
    }
    
    // Move to next question
    this.progressSubject.next({
      ...progress,
      currentQuestionIndex: progress.currentQuestionIndex + 1
    });
    
    // Save progress to localStorage
    this.saveProgressToStorage();
    
    return true;
  }
  
  /**
   * Move to the previous question
   * @returns Boolean indicating if there are previous questions
   */
  prevQuestion(): boolean {
    const progress = this.progressSubject.value;
    if (!progress || !this.survey) return false;
    
    // If we're at the beginning
    if (progress.currentQuestionIndex <= 0) {
      return false;
    }
    
    // Move to previous question
    this.progressSubject.next({
      ...progress,
      currentQuestionIndex: progress.currentQuestionIndex - 1
    });
    
    // Save progress to localStorage
    this.saveProgressToStorage();
    
    return true;
  }
  
  /**
   * Jump to a specific question by index
   * @param index The question index to jump to
   */
  jumpToQuestion(index: number): void {
    const progress = this.progressSubject.value;
    if (!progress || !this.survey) return;
    
    // Validate index is within bounds
    if (index < 0 || index >= this.questions.length) {
      return;
    }
    
    // Update the current question index
    this.progressSubject.next({
      ...progress,
      currentQuestionIndex: index
    });
    
    // Save progress to localStorage
    this.saveProgressToStorage();
  }
  
  /**
   * Check if the current question is valid (has response if required)
   */
  isCurrentQuestionValid(): boolean {
    const progress = this.progressSubject.value;
    if (!progress) return false;
    
    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return true;
    
    // If question is required, check if there's a response
    if (currentQuestion.isRequired) {
      const response = this.getResponse(currentQuestion.id);
      if (response === null || response === undefined) return false;
      
      // For array responses (like multiple choice), check if not empty
      if (Array.isArray(response) && response.length === 0) return false;
      
      // For string responses, check if not empty
      if (typeof response === 'string' && response.trim() === '') return false;
    }
    
    return true;
  }
  
  /**
   * Check if all required questions have been answered
   */
  isComplete(): boolean {
    const progress = this.progressSubject.value;
    if (!progress) return false;
    
    // Check all required questions
    for (const question of this.questions) {
      if (question.isRequired) {
        const response = this.getResponse(question.id);
        if (response === null || response === undefined) return false;
        
        // For array responses (like multiple choice), check if not empty
        if (Array.isArray(response) && response.length === 0) return false;
        
        // For string responses, check if not empty
        if (typeof response === 'string' && response.trim() === '') return false;
      }
    }
    
    return true;
  }
  
  /**
   * Get all responses as an object
   */
  getAllResponses(): { [questionId: string]: any } {
    const progress = this.progressSubject.value;
    if (!progress) return {};
    
    return progress.responses;
  }
  
  /**
   * Clear all progress and responses
   */
  clearProgress(): void {
    if (!this.survey) return;
    
    localStorage.removeItem(`survey_progress_${this.survey.id}`);
    this.stopTimer();
    
    // Reset progress
    if (this.progressSubject.value) {
      this.progressSubject.next({
        ...this.progressSubject.value,
        currentSectionIndex: 0,
        currentQuestionIndex: 0,
        percentComplete: 0,
        responses: {},
        timeSpent: 0,
        startTime: new Date()
      });
    }
    
    this.startTimer();
  }
  
  /**
   * Save current progress to localStorage
   */
  private saveProgressToStorage(): void {
    if (!this.survey) return;
    
    const progress = this.progressSubject.value;
    if (progress) {
      localStorage.setItem(`survey_progress_${this.survey.id}`, JSON.stringify(progress));
    }
  }
  
  /**
   * Load saved progress from localStorage
   * @param surveyId ID of the survey
   */
  loadProgressFromStorage(surveyId: string): any {
    const savedProgress = localStorage.getItem(`survey_progress_${surveyId}`);
    if (savedProgress) {
      try {
        return JSON.parse(savedProgress);
      } catch (e) {
        console.error('Error parsing saved survey progress', e);
      }
    }
    return null;
  }
  
  /**
   * Start the timer to track time spent
   */
  private startTimer(): void {
    this.stopTimer(); // Clear any existing timer
    
    this.timer = setInterval(() => {
      const progress = this.progressSubject.value;
      if (progress) {
        this.progressSubject.next({
          ...progress,
          timeSpent: progress.timeSpent + 1
        });
      }
    }, 1000);
  }
  
  /**
   * Stop the timer
   */
  private stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  /**
   * Clean up resources when service is destroyed
   */
  ngOnDestroy(): void {
    this.stopTimer();
  }}