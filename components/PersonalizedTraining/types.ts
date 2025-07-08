// 개인화 훈련 계획 관련 타입 정의

export interface UserProfile {
  id: string;
  name: string;
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  currentWPM: number;
  targetWPM: number;
  averageAccuracy: number;
  preferredTechniques: string[];
  learningGoals: string[];
  availableTime: number; // 일일 연습 가능 시간 (분)
  practiceFrequency: number; // 주간 연습 횟수
}

export interface TrainingPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  goals: TrainingGoal[];
  exercises: Exercise[];
  schedule: Schedule;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  duration?: number; // 주 단위
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedImprovement?: number; // 예상 개선도 (%)
  weeklyGoals?: WeeklyGoal[];
}

export interface TrainingGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline?: Date;
  achieved: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'speed' | 'accuracy' | 'comprehension' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  content?: string;
  instructions: string[];
  targetMetrics: {
    wpm?: number;
    accuracy?: number;
    comprehension?: number;
  };
  technique?: string;
  materials?: string[];
}

export interface Schedule {
  frequency: 'daily' | 'weekly' | 'custom';
  sessionsPerWeek: number;
  durationPerSession: number; // minutes
  preferredTime?: string;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
}

export interface RecommendedContent {
  id: string;
  title: string;
  type: 'text' | 'exercise' | 'technique';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  estimatedTime: number; // 분 단위
  tags: string[];
  reason: string; // 추천 이유
}

export interface GoalSuggestion {
  id: string;
  type: 'short-term' | 'medium-term' | 'long-term';
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
}

export interface WeaknessAnalysis {
  id: string;
  userId: string;
  weaknesses: Weakness[];
  recommendations: string[];
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  area?: string;
  impact?: 'high' | 'medium' | 'low';
}

export interface Weakness {
  type: 'speed' | 'accuracy' | 'comprehension' | 'consistency';
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: number; // 0-100
  suggestedExercises: string[];
  area?: string;
}

export interface ContentRecommendation {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'article' | 'book' | 'exercise' | 'technique';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  tags: string[];
  relevance: number; // 0-100
  reason: string;
}

export interface PersonalizedRecommendations {
  userProfile: UserProfile;
  trainingPlan: TrainingPlan;
  recommendedContent: RecommendedContent[];
  goalSuggestions: GoalSuggestion[];
  weaknessAnalysis: WeaknessAnalysis[];
  nextSteps: string[];
}

export interface SessionRecord {
  id: string;
  userId: string;
  date: Date;
  duration: number; // minutes
  wpm: number;
  accuracy: number;
  comprehension: number;
  textType: string;
  difficulty: string;
  notes?: string;
  techniques?: string[];
}

export interface WeeklyGoal {
  week: number;
  focus: string;
  exercises: Exercise[];
  targetWPM: number;
  targetAccuracy: number;
} 