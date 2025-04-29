// src/app/core/services/api-mock.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Survey, SurveyStatus, SurveyType } from '../models/survey.model';
import { User } from '../models/user.model';
import { Question, QuestionType } from '../models/question.model';

/**
 * Service pour simuler les appels API pendant le développement
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Base de données simulée
  private surveys: Survey[] = [];
  private users: User[] = [];
  private questions: Question[] = [];
  private responses: any[] = [];

  constructor() {
    this.initMockData();
  }

  /**
   * Initialise des données simulées pour le développement
   */
  private initMockData(): void {
    // Utilisateurs
    this.users = [
      {
        id: 'user1',
        username: 'admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        roles: ['Admin'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: 'user2',
        username: 'surveyor',
        email: 'surveyor@example.com',
        firstName: 'Survey',
        lastName: 'Creator',
        roles: ['surveyor'],
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-02')
      },
      {
        id: 'user3',
        username: 'participant',
        email: 'participant@example.com',
        firstName: 'Survey',
        lastName: 'Participant',
        roles: ['participant'],
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-03')
      }
    ];

    // Questions
    this.questions = [
      {
        id: 'q1',
        title: 'Comment évaluez-vous la qualité de notre service client ?',
        type: QuestionType.RATING,
        isRequired: true,
        order: 1,
        options: [],
        value: null,
        skipped: false,
        maxRating: 0,
        minRating: 0
      },
      {
        id: 'q2',
        title: 'Quelle fonctionnalité aimeriez-vous voir ajoutée à notre produit ?',
        type: QuestionType.TEXT_LONG,
        isRequired: false,
        order: 2,
        options: [],
        value: null,
        skipped: false,
        maxRating: 0,
        minRating: 0
      },
      {
        id: 'q3',
        title: 'Comment avez-vous découvert notre produit ?',
        type: QuestionType.SINGLE_CHOICE,
        isRequired: true,
        order: 3,
        options: [
          { id: 'opt1', text: 'Réseaux sociaux', value: 'social_media' },
          { id: 'opt2', text: 'Moteur de recherche', value: 'search_engine' },
          { id: 'opt3', text: 'Recommandation', value: 'referral' },
          { id: 'opt4', text: 'Publicité', value: 'advertisement' },
        ],
        value: null,
        skipped: false,
        maxRating: 0,
        minRating: 0
      }
    ];

    // Enquêtes
    this.surveys = [
      {
        id: 's1',
        title: 'Satisfaction Client 2023',
        description: 'Évaluation de la satisfaction des clients pour nos services en 2023',
        status: SurveyStatus.PUBLISHED,
        type: SurveyType.SURVEY,
        createdBy: 'user1',
        creationDate: new Date('2023-02-15'),
        sections: [
          {
            id: 'sec1',
            title: 'Satisfaction générale',
            order: 1,
            questions: ['q1', 'q2', 'q3']
          }
        ],
        settings: {
          allowAnonymous: true,
          showProgressBar: true,
          allowIncomplete: false,
          shuffleQuestions: false,
          notifyOnResponse: true,
          thankYouMessage: 'Merci pour votre participation à cette enquête!'
        }
      },
      {
        id: 's2',
        title: 'Évaluation des formations',
        description: 'Évaluation des sessions de formation dispensées aux employés',
        status: SurveyStatus.PUBLISHED,
        type: SurveyType.SURVEY,
        createdBy: 'user2',
        creationDate: new Date('2023-03-01'),
        sections: [
          {
            id: 'sec2',
            title: 'Qualité des formations',
            order: 1,
            questions: ['q1', 'q2']
          }
        ],
        settings: {
          allowAnonymous: false,
          showProgressBar: true,
          allowIncomplete: true,
          shuffleQuestions: false,
          notifyOnResponse: true,
          thankYouMessage: 'Merci pour votre évaluation!'
        }
      },
      {
        id: 's3',
        title: 'Feedback produit',
        description: 'Recueillir des commentaires sur notre nouveau produit',
        status: SurveyStatus.DRAFT,
        type: SurveyType.POLL,
        createdBy: 'user1',
        creationDate: new Date('2023-03-10'),
        sections: [
          {
            id: 'sec3',
            title: 'Feedback',
            order: 1,
            questions: ['q3']
          }
        ],
        settings: {
          allowAnonymous: true,
          showProgressBar: false,
          allowIncomplete: false,
          shuffleQuestions: false,
          notifyOnResponse: false,
          thankYouMessage: 'Merci pour votre feedback!'
        }
      }
    ];

    // Réponses simulées
    this.responses = [
      {
        id: 'r1',
        surveyId: 's1',
        respondentId: 'user3',
        startTime: new Date('2023-02-20T10:15:00'),
        endTime: new Date('2023-02-20T10:20:00'),
        completionStatus: 'complete',
        answers: [
          {
            questionId: 'q1',
            value: 4,
            skipped: false,
            timestamp: new Date('2023-02-20T10:16:00')
          },
          {
            questionId: 'q2',
            value: 'Une meilleure intégration avec les applications mobiles serait appréciée.',
            skipped: false,
            timestamp: new Date('2023-02-20T10:18:00')
          },
          {
            questionId: 'q3',
            value: 'referral',
            skipped: false,
            timestamp: new Date('2023-02-20T10:19:00')
          }
        ],
        metadata: {
          device: 'desktop',
          browser: 'Chrome',
          timeSpent: 300
        }
      }
    ];
  }

  // MÉTHODES DE SIMULATION API

  // Méthodes pour les enquêtes
  getAllSurveys(): Observable<Survey[]> {
    return of([...this.surveys]).pipe(delay(500));
  }

  getSurveyById(id: string): Observable<Survey> {
    const survey = this.surveys.find(s => s.id === id);
    if (survey) {
      return of({...survey}).pipe(delay(300));
    }
    return throwError(() => new Error('Survey not found'));
  }

  createSurvey(survey: Survey): Observable<Survey> {
    const newSurvey = {
      ...survey,
      id: `s${this.surveys.length + 1}`,
      creationDate: new Date()
    };
    this.surveys.push(newSurvey);
    return of({...newSurvey}).pipe(delay(500));
  }

  updateSurvey(id: string, updatedSurvey: Survey): Observable<Survey> {
    const index = this.surveys.findIndex(s => s.id === id);
    if (index !== -1) {
      this.surveys[index] = { ...this.surveys[index], ...updatedSurvey };
      return of({...this.surveys[index]}).pipe(delay(500));
    }
    return throwError(() => new Error('Survey not found'));
  }

  deleteSurvey(id: string): Observable<boolean> {
    const index = this.surveys.findIndex(s => s.id === id);
    if (index !== -1) {
      this.surveys.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return throwError(() => new Error('Survey not found'));
  }

  // Méthodes pour les questions
  getAllQuestions(): Observable<Question[]> {
    return of([...this.questions]).pipe(delay(500));
  }

  getQuestionById(id: string): Observable<Question> {
    const question = this.questions.find(q => q.id === id);
    if (question) {
      return of({...question}).pipe(delay(300));
    }
    return throwError(() => new Error('Question not found'));
  }

  createQuestion(question: Question): Observable<Question> {
    const newQuestion = {
      ...question,
      id: `q${this.questions.length + 1}`
    };
    this.questions.push(newQuestion);
    return of({...newQuestion}).pipe(delay(500));
  }

  // Méthodes pour les utilisateurs
  getAllUsers(): Observable<User[]> {
    return of([...this.users]).pipe(delay(500));
  }

  getUserById(id: string): Observable<User> {
    const user = this.users.find(u => u.id === id);
    if (user) {
      return of({...user}).pipe(delay(300));
    }
    return throwError(() => new Error('User not found'));
  }

  // Méthodes pour les réponses
  getSurveyResponses(surveyId: string): Observable<any[]> {
    const filteredResponses = this.responses.filter(r => r.surveyId === surveyId);
    return of([...filteredResponses]).pipe(delay(500));
  }

  // Méthodes analytics
  getSurveyAnalytics(surveyId: string): Observable<any> {
    // Simuler des données analytiques
    return of({
      totalResponses: 254,
      completionRate: 76,
      averageRating: 4.2,
      averageTime: 204, // secondes
      questions: [
        {
          id: 'q1',
          title: 'Comment évaluez-vous la qualité de notre service client ?',
          type: 'rating',
          responseRate: 98,
          averageRating: 4.2,
          ratingDistribution: [
            { rating: 1, count: 12, percentage: 5 },
            { rating: 2, count: 30, percentage: 12 },
            { rating: 3, count: 45, percentage: 18 },
            { rating: 4, count: 115, percentage: 45 },
            { rating: 5, count: 52, percentage: 20 },
          ],
        },
        {
          id: 'q2',
          title: 'Quelle fonctionnalité aimeriez-vous voir ajoutée à notre produit ?',
          type: 'text_short',
          responseRate: 65,
          wordFrequency: [
            { text: 'intégration', frequency: 45 },
            { text: 'mobile', frequency: 38 },
            { text: 'notifications', frequency: 32 },
            { text: 'personnalisation', frequency: 28 },
            { text: 'rapports', frequency: 25 },
          ],
        },
        {
          id: 'q3',
          title: 'Comment avez-vous découvert notre produit ?',
          type: 'single_choice',
          responseRate: 95,
          optionCounts: [
            {
              optionId: 'opt1',
              optionText: 'Réseaux sociaux',
              count: 98,
              percentage: 38,
            },
            {
              optionId: 'opt2',
              optionText: 'Moteur de recherche',
              count: 82,
              percentage: 32,
            },
            {
              optionId: 'opt3',
              optionText: 'Recommandation',
              count: 44,
              percentage: 17,
            },
            {
              optionId: 'opt4',
              optionText: 'Publicité',
              count: 30,
              percentage: 13,
            },
          ],
        },
      ],
    }).pipe(delay(700));
  }
}