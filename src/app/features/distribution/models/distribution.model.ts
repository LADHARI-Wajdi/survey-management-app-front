// features/distribution/models/distribution.model.ts
export enum DistributionMethod {
  EMAIL = 'email',
  LINK = 'link',
  QR_CODE = 'qr_code',
  IFRAME = 'iframe',
  SOCIAL = 'social',
}

export enum DistributionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  LINKEDIN = 'linkedin',
  WHATSAPP = 'whatsapp',
}

export interface DistributionLink {
  id: string;
  surveyId: string;
  token: string;
  url: string;
  createdAt: Date;
  expiresAt?: Date;
  createdBy: string;
  isActive: boolean;
  clickCount: number;
  responseCount: number;
  lastClickedAt?: Date;
  customParams?: { [key: string]: string };
}

export interface QrCode {
  id: string;
  surveyId: string;
  token: string;
  imageUrl: string;
  createdAt: Date;
  expiresAt?: Date;
  createdBy: string;
  isActive: boolean;
  scanCount: number;
  responseCount: number;
  lastScannedAt?: Date;
  size: number;
  colorPrimary: string;
  colorBackground: string;
  withLogo: boolean;
  logoUrl?: string;
}

export interface IframeEmbed {
  id: string;
  surveyId: string;
  token: string;
  embedCode: string;
  embedUrl: string;
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
  viewCount: number;
  responseCount: number;
  lastViewedAt?: Date;
  width: number;
  height: number;
  allowFullscreen: boolean;
  customCss?: string;
}

export interface SocialShare {
  id: string;
  surveyId: string;
  platform: SocialPlatform;
  url: string;
  message?: string;
  createdAt: Date;
  createdBy: string;
  shareCount: number;
  clickCount: number;
  responseCount: number;
  lastSharedAt?: Date;
}

export interface DistributionEvent {
  id: string;
  surveyId: string;
  distributionMethod: DistributionMethod;
  eventType: 'create' | 'view' | 'click' | 'response' | 'complete' | 'error';
  timestamp: Date;
  data: any;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  device?: 'desktop' | 'mobile' | 'tablet';
  referrer?: string;
}

export interface DistributionStatistics {
  totalDistributions: number;
  totalViews: number;
  totalResponses: number;
  conversionRate: number;
  byMethod: {
    [method in DistributionMethod]?: {
      distributions: number;
      views: number;
      responses: number;
      conversionRate: number;
    };
  };
  byTimeFrame: {
    daily: Array<{ date: string; count: number }>;
    weekly: Array<{ week: string; count: number }>;
    monthly: Array<{ month: string; count: number }>;
  };
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  geographicDistribution?: {
    [country: string]: number;
  };
  referrers?: {
    [referrer: string]: number;
  };
}

export interface DistributionRecipient {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  method?: DistributionMethod;
  status: 'pending' | 'sent' | 'opened' | 'clicked' | 'completed';
  lastSentAt?: Date;
  responseId?: string;
  customData?: { [key: string]: any };
}
