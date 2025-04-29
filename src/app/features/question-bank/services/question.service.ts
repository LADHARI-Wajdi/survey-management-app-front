import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Question, QuestionType } from '../../../core/models/question.model';
import { environements } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  [x: string]: any;

  constructor(private http: HttpClient) {}
  reorderQuestions(questionIds: string[]) {
    throw new Error('Method not implemented.');
  }
  duplicateQuestion(questionId: string): Observable<Question> {
    return this.http.post<Question>(`${this['apiUrl']}/questions/${questionId}/duplicate`, {}).pipe(
      catchError(this.handleError<Question>('duplicateQuestion'))
    );
  }

  /**
   * Get all questions
   */
  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this['apiUrl']).pipe(
      catchError(this.handleError<Question[]>('getAllQuestions', []))
    );
  }

  /**
   * Get question by ID
   */
  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(`${this['apiUrl']}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching question', error);
        // Return a mock question for development
        return of(this.getMockQuestion(id));
      })
    );
  }

  /**
   * Create a new question
   */
  createQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(this['apiUrl'], question).pipe(
      catchError(error => {
        console.error('Error creating question', error);
        // Return a mock response for development
        return of({
          ...question,
          id: this.generateMockId(),
          order: 0
        } as Question);
      })
    );
  }

  /**
   * Update an existing question
   */
  updateQuestion(id: string, question: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this['apiUrl']}/${id}`, question).pipe(
      catchError(error => {
        console.error('Error updating question', error);
        // Return a mock response for development
        return of({
          ...question,
          id: id,
        } as Question);
      })
    );
  }

  /**
   * Delete a question
   */
  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this['apiUrl']}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting question', error);
        // Return a mock success response
        return of({ success: true });
      })
    );
  }

  /**
   * Get questions by type
   */
  getQuestionsByType(type: QuestionType): Observable<Question[]> {
    return this.http.get<Question[]>(`${this['apiUrl']}/type/${type}`).pipe(
      catchError(this.handleError<Question[]>(`getQuestionsByType ${type}`, []))
    );
  }

  /**
   * Get all question templates
   */
  getQuestionTemplates(): Observable<Question[]> {
    return this.http.get<Question[]>(`${this['apiUrl']}/templates`).pipe(
      catchError(this.handleError<Question[]>('getQuestionTemplates', []))
    );
  }

  /**
   * Error handler
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      // Let the app keep running by returning an empty result
      return of(result as T);
    };
  }

  /**
   * Generate a mock ID for development
   */
  private generateMockId(): string {
    return 'q_' + Math.random().toString(36).substring(2, 11);
  }

  /**
   * Get a mock question for development
   */
  private getMockQuestion(id: string): Question {
    return {
      id: id,
      title: 'Comment évaluez-vous notre service client ?',
      description: 'Veuillez noter notre service de 1 à 5 étoiles.',
      type: QuestionType.RATING,
      isRequired: true,
      order: 1,
      options: [],
      settings: {
        ratingSymbol: 'star',
        minValue: 1,
        maxValue: 5
      },
      skipped: false,
      maxRating: 5,
      minRating: 1,
      value: null
    };
  }
}