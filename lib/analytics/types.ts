export interface AnalyticsData {
  id: string;
  userId: string;
  sessionId: string;
  timestamp: Date;
  metrics: {
    wpm: number;
    accuracy: number;
    totalTime: number; // in seconds
    [key: string]: number; // Allow other numeric metrics
  };
  events: Array<{
    type: string;
    timestamp: Date;
    details: Record<string, unknown>;
  }>;
}

export interface PerformanceReport {
  id: string;
  userId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  summary: PerformanceSummary;
  trends: PerformanceTrends;
  insights: PerformanceInsight[];
  recommendations: string[];
  generatedAt: Date;
}

export interface PerformanceSummary {
  totalSessions: number;
  totalTime: number; // minutes
  averageWpm: number;
  averageAccuracy: number;
  bestWpm: number;
  bestAccuracy: number;
  consistency: number; // 0-1
  improvement: number; // percentage
  goalsAchieved: number;
  totalGoals: number;
}

export interface PerformanceTrends {
  wpmTrend: Array<{ date: Date; value: number; change: number }>;
  accuracyTrend: Array<{ date: Date; value: number; change: number }>;
  consistencyTrend: Array<{ date: Date; value: number; change: number }>;
  timeSpentTrend: Array<{ date: Date; value: number; change: number }>;
  techniqueUsageTrend: Array<{ technique: string; usage: number; effectiveness: number }>;
}

export interface TrendData {
  date: Date;
  value: number;
  change: number; // percentage change from previous period
}

export interface TechniqueUsageData {
  technique: string;
  usageCount: number;
  averageEffectiveness: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface PerformanceInsight {
  id: string;
  type: 'improvement' | 'decline' | 'pattern' | 'anomaly' | 'milestone';
  title: string;
  description: string;
  significance: 'low' | 'medium' | 'high';
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  description: string;
  milestones: LearningMilestone[];
  currentMilestone: number;
  progress: number; // 0-100
  estimatedCompletion: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningMilestone {
  id: string;
  title: string;
  description: string;
  criteria: MilestoneCriteria;
  achieved: boolean;
  achievedAt?: Date;
  order: number;
}

export interface MilestoneCriteria {
  wpmThreshold?: number;
  accuracyThreshold?: number;
  sessionsCompleted?: number;
  techniquesMastered?: string[];
  timeSpent?: number;
}

export interface ComparativeAnalysis {
  id: string;
  userId: string;
  comparisonType: 'self' | 'peer' | 'benchmark';
  period: DateRange;
  metrics: ComparativeMetrics;
  insights: string[];
  generatedAt: Date;
}

export interface ComparativeMetrics {
  wpm: {
    user: number;
    comparison: number;
    percentile: number;
  };
  accuracy: {
    user: number;
    comparison: number;
    percentile: number;
  };
  consistency: {
    user: number;
    comparison: number;
    percentile: number;
  };
  improvement: {
    user: number;
    comparison: number;
    percentile: number;
  };
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json' | 'excel';
  period: DateRange;
  includeCharts: boolean;
  includeInsights: boolean;
  includeRecommendations: boolean;
  customFields?: string[];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'summary' | 'chart' | 'table' | 'insights' | 'recommendations';
  config: Record<string, unknown>;
  order: number;
}

export interface PredictiveAnalytics {
  userId: string;
  predictions: Prediction[];
  confidence: number;
  generatedAt: Date;
}

export interface Prediction {
  type: 'wpm' | 'accuracy' | 'goal_achievement' | 'plateau';
  value: number;
  timeframe: number; // days
  confidence: number;
  factors: string[];
} 