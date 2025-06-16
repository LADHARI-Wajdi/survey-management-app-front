// core/models/survey.model.ts
import { Question } from './question.model';

export enum SurveyStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CLOSED = 'closed',
}

export enum SurveyType {
  GENERAL = 'GENERAL',
  ACADEMIC = 'ACADEMIC',
  CUSTOMER = 'CUSTOMER',
  EMPLOYEE = 'EMPLOYEE',
  MARKET_RESEARCH = 'MARKET_RESEARCH',
  TEMPLATE = 'TEMPLATE'
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
  questions: Question[];
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
