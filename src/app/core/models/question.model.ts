// src/app/core/models/question.model.ts
export enum QuestionType {
  TEXT_SHORT = 'text_short',
  TEXT_LONG = 'text_long',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  RATING = 'rating',
  DATE = 'date',
  FILE = 'file',
  MATRIX = 'matrix',
  RANKING = 'ranking',
  NUMERIC = 'numeric',
}

// Type qui représente les différentes valeurs possibles pour une question
export type QuestionValue = string | string[] | number | File[] | null;

export interface Question {
  skipped: any;
  maxRating: number;
  minRating: number;
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  isRequired: boolean;
  order: number;
  options?: QuestionOption[];
  settings?: QuestionSettings;
  conditionalLogic?: ConditionalLogic[];
  validations?: QuestionValidation[];
  // Permettre null comme une valeur valide
  value: QuestionValue;
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  imageUrl?: string;
  isOther?: boolean;
}

export interface QuestionSettings {
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
  allowMultipleFiles?: boolean;
  maxFileSize?: number;
  acceptedFileTypes?: string[];
  rows?: number;
  columns?: number;
  ratingSymbol?: 'star' | 'number' | 'emoji';
  includeNotApplicable?: boolean;
  shuffleOptions?: boolean;
  layout?: 'vertical' | 'horizontal' | 'grid';
}

export interface ConditionalLogic {
  questionId: string;
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'not_contains'
    | 'greater_than'
    | 'less_than';
  value: string | number | string[];
  action: 'show' | 'hide' | 'require' | 'skip_to';
  targetId?: string; // Used for skip_to action
}

export interface QuestionValidation {
  type:
    | 'required'
    | 'email'
    | 'url'
    | 'regex'
    | 'min_length'
    | 'max_length'
    | 'min_value'
    | 'max_value';
  value?: string | number;
  errorMessage?: string;
}