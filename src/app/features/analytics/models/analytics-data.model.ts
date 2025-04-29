// src/app/features/analytics/models/analytics.model.ts

export enum TimeRange {
    LAST_7_DAYS = 'LAST_7_DAYS',
    LAST_30_DAYS = 'LAST_30_DAYS',
    LAST_90_DAYS = 'LAST_90_DAYS',
    LAST_12_MONTHS = 'LAST_12_MONTHS',
    ALL_TIME = 'ALL_TIME'
  }
  
  export interface DashboardStats {
    totalSurveys: number;
    totalResponses: number;
    averageCompletionRate: number;
    averageTimeToComplete: number;
  }
  
  export interface AnalyticsDataPoint {
    label: string;
    value: number;
  }
  
  export interface TimeSeriesDataPoint {
    date: string;
    value: number;
  }
  
  export interface DeviceBreakdown {
    desktop: number;
    mobile: number;
    tablet: number;
  }
  
  export interface DemographicBreakdown {
    category: string;
    count: number;
  }
  
  export interface ResponseTrend {
    date: string;
    responses: number;
  }
  
  export interface CompletionRateData {
    completed: number;
    abandoned: number;
  }
  
  export interface QuestionTypeDistribution {
    type: string;
    count: number;
  }
  export interface TimeRanges {
    value: string;
    label: string;
  }