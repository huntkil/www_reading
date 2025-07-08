// 대시보드 관련 타입 정의

export interface SessionRecord {
  date: string;
  wpm: number;
  accuracy: number;
  improvement: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  techniques: string[];
}

export interface ProgressStats {
  totalSessions: number;
  totalTime: number; // 분 단위
  averageWPM: number;
  maxWPM: number;
  averageAccuracy: number;
  consistencyScore: number; // 0-100
  improvementRate: number; // %
  practiceDays: number;
  currentStreak: number;
}

export interface ChartDataPoint {
  date: string;
  wpm: number;
  accuracy: number;
  improvement: number;
}

export interface LevelDistribution {
  beginner: number;
  intermediate: number;
  advanced: number;
}

export interface TechniqueUsage {
  technique: string;
  count: number;
  percentage: number;
}

export interface ProgressAnalysis {
  stats: ProgressStats;
  chartData: ChartDataPoint[];
  levelDistribution: LevelDistribution;
  techniqueUsage: TechniqueUsage[];
  recentTrend: 'improving' | 'declining' | 'stable';
  recommendations: string[];
}

export interface DashboardProps {
  sessions: SessionRecord[];
  isLoading?: boolean;
  onGenerateReport?: () => void;
} 