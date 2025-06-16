import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Question, QuestionType } from '../../../core/models/question.model';
import { environements } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = `${environements.apiUrl}/questions`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token'); // Adjust storage mechanism if needed
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  reorderQuestions(questionIds: string[]) {
    throw new Error('Method not implemented.');
  }

  duplicateQuestion(questionId: string): Observable<Question> {
    return this.http.post<Question>(
      `${this.apiUrl}/${questionId}/duplicate`,
      {},
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError<Question>('duplicateQuestion'))
    );
  }

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(
      this.apiUrl,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError<Question[]>('getAllQuestions', []))
    );
  }

  getQuestionById(id: string): Observable<Question> {
    return this.http.get<Question>(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error fetching question', error);
        return of(this.getMockQuestion(id));
      })
    );
  }

  createQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(
      this.apiUrl,
      question,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error creating question', error);
        return of({
          ...question,
          id: this.generateMockId(),
          order: 0
        } as Question);
      })
    );
  }

  updateQuestion(id: string, question: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(
      `${this.apiUrl}/${id}`,
      question,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error updating question', error);
        return of({
          ...question,
          id: id,
        } as Question);
      })
    );
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error deleting question', error);
        return of({ success: true });
      })
    );
  }

  getQuestionsByType(type: QuestionType): Observable<Question[]> {
    return this.http.get<Question[]>(
      `${this.apiUrl}/type/${type}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError<Question[]>(`getQuestionsByType ${type}`, []))
    );
  }

  getQuestionTemplates(): Observable<Question[]> {
    return this.http.get<Question[]>(
      `${this.apiUrl}/templates`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(this.handleError<Question[]>('getQuestionTemplates', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return of(result as T);
    };
  }

  private generateMockId(): string {
    return 'q_' + Math.random().toString(36).substring(2, 11);
  }

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
