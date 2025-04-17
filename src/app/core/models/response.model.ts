// core/models/response.model.ts
export interface Response {
  id: string;
  surveyId: string;
  respondentId?: string; // Can be null for anonymous responses
  startTime: Date;
  endTime?: Date;
  completionStatus: 'complete' | 'partial' | 'abandoned';
  answers: Answer[];
  metadata?: ResponseMetadata;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number | File[] | any; // The actual answer value depends on question type
  skipped: boolean;
  timestamp: Date;
}

export interface ResponseMetadata {
  userAgent?: string;
  ipAddress?: string;
  geolocation?: {
    country?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  device?: 'desktop' | 'tablet' | 'mobile';
  referrer?: string;
  timeSpent?: number; // Time spent in seconds
  language?: string;
}
