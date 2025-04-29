// core/models/survey.model.ts
export enum SurveyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

export enum SurveyType {
  SURVEY = 'survey',
  POLL = 'poll',
  QUIZ = 'quiz',
}

export interface Survey {
[x: string]: any;
  id: string;
  title: string;
  description?: string;
  status: SurveyStatus;
  type: SurveyType;
  createdBy: string;
  creationDate: Date;
  expirationDate?: Date;
  sections: SurveySection[];
  settings: SurveySettings;
}

export interface SurveySection {
  id: string;
  title: string;
  description?: string;
  order: number;
  questions: string[]; // IDs of questions
}

export interface SurveySettings {
  allowAnonymous: boolean;
  showProgressBar: boolean;
  allowIncomplete: boolean;
  shuffleQuestions: boolean;
  responseLimit?: number;
  notifyOnResponse: boolean;
  thankYouMessage?: string;
  customStyle?: {
    backgroundColor?: string;
    headerColor?: string;
    fontFamily?: string;
    logoUrl?: string;
  };
  accessControl?: {
    requireLogin: boolean;
    password?: string;
    restrictByDomain?: string[];
    restrictByIP?: string[];
  };
}
