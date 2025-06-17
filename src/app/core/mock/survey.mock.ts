import { Survey, SurveyStatus, SurveyType } from '../models/survey.model';
import { QuestionTypeEnum } from '../../features/question-bank/models/question-type.model';

export const mockSurveys: Survey[] = [
  {
    id: 's1',
    title: 'Satisfaction Client 2024',
    description: 'Évaluation de la satisfaction des clients pour nos services en 2024',
    status: SurveyStatus.PUBLISHED,
    type: SurveyType.CUSTOMER,
    createdBy: 'user1',
    creationDate: new Date('2024-01-15'),
    expirationDate: new Date('2024-12-31'),
    sections: [
      {
        id: 'sec1',
        title: 'Satisfaction générale',
        description: 'Votre expérience globale avec nos services',
        order: 1,
        questions: [
          {
            id: 'q1',
            title: 'Comment évaluez-vous votre satisfaction globale ?',
            type: QuestionTypeEnum.RATING,
            isRequired: true,
            order: 1,
            maxRating: 5,
            minRating: 1
          },
          {
            id: 'q2',
            title: 'Quels aspects de notre service appréciez-vous le plus ?',
            type: QuestionTypeEnum.MULTIPLE_CHOICE,
            isRequired: false,
            order: 2,
            options: [
              { id: 'opt1', text: 'Qualité du service' },
              { id: 'opt2', text: 'Rapidité de réponse' },
              { id: 'opt3', text: 'Prix' },
              { id: 'opt4', text: 'Support client' }
            ]
          }
        ]
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
    title: 'Évaluation des formations internes',
    description: 'Évaluation des sessions de formation dispensées aux employés',
    status: SurveyStatus.PUBLISHED,
    type: SurveyType.EMPLOYEE,
    createdBy: 'user2',
    creationDate: new Date('2024-02-01'),
    sections: [
      {
        id: 'sec2',
        title: 'Qualité des formations',
        description: 'Votre retour sur les formations suivies',
        order: 1,
        questions: [
          {
            id: 'q3',
            title: 'Le contenu de la formation était-il pertinent ?',
            type: QuestionTypeEnum.SCALE,
            isRequired: true,
            order: 1,
            maxRating: 10,
            minRating: 1
          },
          {
            id: 'q4',
            title: 'Quelles compétences avez-vous acquises ?',
            type: QuestionTypeEnum.TEXT_LONG,
            isRequired: false,
            order: 2
          }
        ]
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
    title: 'Étude de marché - Nouvelles fonctionnalités',
    description: 'Évaluation de l\'intérêt pour de nouvelles fonctionnalités',
    status: SurveyStatus.DRAFT,
    type: SurveyType.MARKET_RESEARCH,
    createdBy: 'user1',
    creationDate: new Date('2024-03-01'),
    sections: [
      {
        id: 'sec3',
        title: 'Nouvelles fonctionnalités',
        description: 'Votre avis sur les fonctionnalités proposées',
        order: 1,
        questions: [
          {
            id: 'q5',
            title: 'Quelles fonctionnalités vous intéressent le plus ?',
            type: QuestionTypeEnum.RANKING,
            isRequired: true,
            order: 1,
            options: [
              { id: 'opt5', text: 'Application mobile' },
              { id: 'opt6', text: 'Intégration IA' },
              { id: 'opt7', text: 'Tableau de bord personnalisé' },
              { id: 'opt8', text: 'Export de données avancé' }
            ]
          },
          {
            id: 'q6',
            title: 'Quel serait votre budget pour ces fonctionnalités ?',
            type: QuestionTypeEnum.NUMERIC,
            isRequired: true,
            order: 2
          }
        ]
      }
    ],
    settings: {
      allowAnonymous: true,
      showProgressBar: true,
      allowIncomplete: false,
      shuffleQuestions: true,
      notifyOnResponse: true,
      thankYouMessage: 'Merci pour votre contribution à notre étude!'
    }
  }
]; 