export interface OpenAIConfig {
  apiKey: string;
  model: 'gpt-4' | 'gpt-3.5-turbo' | 'gpt-4-turbo';
  maxTokens: number;
  temperature: number;
  baseURL?: string;
}

export interface SessionAnalysis {
  id: string;
  sessionId: string;
  timestamp: Date;
  analysis: {
    overallScore: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    nextGoals: string[];
    emotionalState: 'positive' | 'neutral' | 'negative';
    focusAreas: string[];
  };
  aiFeedback: string;
  improvementTips: string[];
}

export interface ContentRecommendation {
  id: string;
  userId: string;
  type: 'text' | 'exercise' | 'technique' | 'goal';
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number; // minutes
  tags: string[];
  content: string;
  reasoning: string;
  confidence: number; // 0-1
  createdAt: Date;
}

export interface PersonalizedPlan {
  id: string;
  userId: string;
  title: string;
  description: string;
  duration: number; // days
  goals: string[];
  exercises: PersonalizedExercise[];
  schedule: WeeklySchedule;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalizedExercise {
  id: string;
  type: 'reading' | 'breathing' | 'focus' | 'speed' | 'comprehension';
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  materials: string[];
  instructions: string[];
  expectedOutcome: string;
}

export interface WeeklySchedule {
  monday: PersonalizedExercise[];
  tuesday: PersonalizedExercise[];
  wednesday: PersonalizedExercise[];
  thursday: PersonalizedExercise[];
  friday: PersonalizedExercise[];
  saturday: PersonalizedExercise[];
  sunday: PersonalizedExercise[];
}

export interface NLPResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  keywords: string[];
  topics: string[];
  readingLevel: 'elementary' | 'middle' | 'high' | 'college';
  complexity: number; // 0-1
  summary: string;
  questions: string[];
}

export interface AIFeedback {
  sessionId: string;
  timestamp: Date;
  feedback: {
    technical: string[];
    emotional: string[];
    progress: string[];
    motivation: string[];
  };
  suggestions: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  encouragement: string;
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  variables: string[];
  category: 'analysis' | 'recommendation' | 'feedback' | 'planning';
}

export interface AIResponse {
  success: boolean;
  data?: {
    content?: string | null;
    [key: string]: unknown;
  };
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null;
}

export interface UserProfile {
  userId: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  goals: string[];
  currentLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  timeAvailability: number; // minutes per day
  preferredDifficulty: 'easy' | 'moderate' | 'challenging';
  focusAreas: string[];
} 