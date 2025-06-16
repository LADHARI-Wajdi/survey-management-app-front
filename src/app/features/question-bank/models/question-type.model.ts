// features/question-bank/models/question-type.model.ts

// Enum des types de questions disponibles
export enum QuestionTypeEnum {
    TEXT_SHORT = 'text_short',
    TEXT_LONG = 'text_long',
    SINGLE_CHOICE = 'single_choice',
    MULTIPLE_CHOICE = 'multiple_choice',
    RATING = 'rating',
    SCALE = 'scale',
    DATE = 'date',
    FILE = 'file',
    MATRIX = 'matrix',
    RANKING = 'ranking',
    NUMERIC = 'numeric'
  }
  
  // Interface pour décrire un type de question
  export interface QuestionType {
    id: QuestionTypeEnum;
    name: string;
    description: string;
    icon: string;
    responseType: 'text' | 'choice' | 'number' | 'date' | 'file' | 'matrix';
    hasOptions: boolean;
    hasSubQuestions: boolean;
    canRequireComment: boolean;
    maxOptionsLimit?: number;
  }
  
  // Liste des types de questions avec leurs attributs
  export const QUESTION_TYPES: QuestionType[] = [
    {
      id: QuestionTypeEnum.TEXT_SHORT,
      name: 'Réponse courte',
      description: 'Permet une réponse textuelle courte (une ligne)',
      icon: 'short_text',
      responseType: 'text',
      hasOptions: false,
      hasSubQuestions: false,
      canRequireComment: false
    },
    {
      id: QuestionTypeEnum.TEXT_LONG,
      name: 'Réponse longue',
      description: 'Permet une réponse textuelle longue (plusieurs lignes)',
      icon: 'notes',
      responseType: 'text',
      hasOptions: false,
      hasSubQuestions: false,
      canRequireComment: false
    },
    {
      id: QuestionTypeEnum.SINGLE_CHOICE,
      name: 'Choix unique',
      description: 'Permet de sélectionner une seule option parmi plusieurs',
      icon: 'radio_button_checked',
      responseType: 'choice',
      hasOptions: true,
      hasSubQuestions: false,
      canRequireComment: true
    },
    {
      id: QuestionTypeEnum.MULTIPLE_CHOICE,
      name: 'Choix multiple',
      description: 'Permet de sélectionner plusieurs options',
      icon: 'check_box',
      responseType: 'choice',
      hasOptions: true,
      hasSubQuestions: false,
      canRequireComment: true
    },
    {
      id: QuestionTypeEnum.RATING,
      name: 'Évaluation',
      description: 'Permet une évaluation sur une échelle d\'étoiles',
      icon: 'star_rate',
      responseType: 'number',
      hasOptions: false,
      hasSubQuestions: false,
      canRequireComment: true
    },
    {
      id: QuestionTypeEnum.SCALE,
      name: 'Échelle',
      description: 'Permet d\'indiquer un niveau sur une échelle numérique',
      icon: 'linear_scale',
      responseType: 'number',
      hasOptions: false,
      hasSubQuestions: false,
      canRequireComment: true
    },
    {
      id: QuestionTypeEnum.DATE,
      name: 'Date',
      description: 'Permet de sélectionner une date',
      icon: 'calendar_today',
      responseType: 'date',
      hasOptions: false,
      hasSubQuestions: false,
      canRequireComment: false
    },
    {
      id: QuestionTypeEnum.FILE,
      name: 'Fichier',
      description: 'Permet de télécharger un fichier',
      icon: 'upload_file',
      responseType: 'file',
      hasOptions: false,
      hasSubQuestions: false,
      canRequireComment: false
    },
    {
      id: QuestionTypeEnum.MATRIX,
      name: 'Matrice',
      description: 'Permet d\'évaluer plusieurs éléments selon plusieurs critères',
      icon: 'grid_on',
      responseType: 'matrix',
      hasOptions: true,
      hasSubQuestions: true,
      canRequireComment: false
    },
    {
      id: QuestionTypeEnum.RANKING,
      name: 'Classement',
      description: 'Permet de classer des éléments par ordre de préférence',
      icon: 'sort',
      responseType: 'choice',
      hasOptions: true,
      hasSubQuestions: false,
      canRequireComment: false,
      maxOptionsLimit: 10
    },
    {
      id: QuestionTypeEnum.NUMERIC,
      name: 'Numérique',
      description: 'Permet de saisir une valeur numérique',
      icon: 'pin',
      responseType: 'number',
      hasOptions: false,
      hasSubQuestions: false,
      canRequireComment: false
    }
  ];
  
  // Fonction utilitaire pour récupérer les détails d'un type de question
  export function getQuestionTypeDetails(typeId: QuestionTypeEnum): QuestionType | undefined {
    return QUESTION_TYPES.find(type => type.id === typeId);
  }
  
  // Fonction utilitaire pour récupérer le nom d'affichage d'un type de question
  export function getQuestionTypeName(typeId: QuestionTypeEnum): string {
    const questionType = getQuestionTypeDetails(typeId);
    return questionType ? questionType.name : typeId;
  }