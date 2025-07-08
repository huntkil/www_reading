import { 
  SessionAnalysis, 
  AIFeedback, 
  ContentRecommendation, 
  PersonalizedPlan,
  UserProfile,
  NLPResult,
  PersonalizedExercise
} from './types';
import { Session } from '@/lib/types';
import { OpenAIClient } from './openaiClient';

// Helper function to safely parse JSON
function safeJsonParse<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return null;
  }
}

export class AnalysisService {
  private openAIClient: OpenAIClient;
  private analyses: Map<string, SessionAnalysis> = new Map();
  private feedbacks: Map<string, AIFeedback> = new Map();
  private recommendations: Map<string, ContentRecommendation[]> = new Map();
  private plans: Map<string, PersonalizedPlan> = new Map();

  constructor(openAIClient: OpenAIClient) {
    this.openAIClient = openAIClient;
  }

  async analyzeSession(sessionData: Session): Promise<SessionAnalysis> {
    try {
      const response = await this.openAIClient.analyzeSession(sessionData);
      
      if (!response.success || !response.data?.content) {
        throw new Error(response.error || '세션 분석에 실패했습니다.');
      }

      const analysisData = safeJsonParse<Partial<SessionAnalysis['analysis'] & { aiFeedback: string; improvementTips: string[] }>>(response.data.content);
      if (!analysisData) {
        throw new Error('AI 응답을 파싱할 수 없습니다.');
      }

      const analysis: SessionAnalysis = {
        id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionId: sessionData.id,
        timestamp: new Date(),
        analysis: {
          overallScore: analysisData.overallScore || 0,
          strengths: analysisData.strengths || [],
          weaknesses: analysisData.weaknesses || [],
          recommendations: analysisData.recommendations || [],
          nextGoals: analysisData.nextGoals || [],
          emotionalState: analysisData.emotionalState || 'neutral',
          focusAreas: analysisData.focusAreas || []
        },
        aiFeedback: analysisData.aiFeedback || '',
        improvementTips: analysisData.improvementTips || []
      };

      this.analyses.set(analysis.id, analysis);
      return analysis;
    } catch (error) {
      console.error('Session analysis failed:', error);
      throw error;
    }
  }

  async generateFeedback(sessionData: Session, userProfile: UserProfile): Promise<AIFeedback> {
    try {
      const response = await this.openAIClient.generateFeedback(sessionData, userProfile);
      
      if (!response.success || !response.data?.content) {
        throw new Error(response.error || '피드백 생성에 실패했습니다.');
      }

      const feedbackData = safeJsonParse<Partial<AIFeedback>>(response.data.content);
      if (!feedbackData) {
        throw new Error('AI 응답을 파싱할 수 없습니다.');
      }

      const feedback: AIFeedback = {
        sessionId: sessionData.id,
        timestamp: new Date(),
        feedback: {
          technical: feedbackData.feedback?.technical || [],
          emotional: feedbackData.feedback?.emotional || [],
          progress: feedbackData.feedback?.progress || [],
          motivation: feedbackData.feedback?.motivation || []
        },
        suggestions: {
          immediate: feedbackData.suggestions?.immediate || [],
          shortTerm: feedbackData.suggestions?.shortTerm || [],
          longTerm: feedbackData.suggestions?.longTerm || []
        },
        encouragement: feedbackData.encouragement || ''
      };

      this.feedbacks.set(feedback.sessionId, feedback);
      return feedback;
    } catch (error) {
      console.error('Feedback generation failed:', error);
      throw error;
    }
  }

  async generateRecommendations(
    userProfile: UserProfile, 
    sessionHistory: Session[]
  ): Promise<ContentRecommendation[]> {
    try {
      const response = await this.openAIClient.generateRecommendations(userProfile, sessionHistory);
      
      if (!response.success || !response.data?.content) {
        throw new Error(response.error || '추천 생성에 실패했습니다.');
      }

      const recommendationData = safeJsonParse<{ recommendations: Partial<ContentRecommendation>[] }>(response.data.content);
      if (!recommendationData) {
        throw new Error('AI 응답을 파싱할 수 없습니다.');
      }

      const recommendations: ContentRecommendation[] = (recommendationData.recommendations || []).map(
        (rec: Partial<ContentRecommendation>, index: number) => ({
          id: `rec_${Date.now()}_${index}`,
          userId: userProfile.userId,
          type: rec.type || 'text',
          title: rec.title || '',
          description: rec.description || '',
          difficulty: rec.difficulty || 'intermediate',
          estimatedTime: rec.estimatedTime || 30,
          tags: rec.tags || [],
          content: rec.content || '',
          reasoning: rec.reasoning || '',
          confidence: rec.confidence || 0.5,
          createdAt: new Date()
        })
      );

      this.recommendations.set(userProfile.userId, recommendations);
      return recommendations;
    } catch (error) {
      console.error('Recommendation generation failed:', error);
      throw error;
    }
  }

  async createPersonalizedPlan(
    userProfile: UserProfile, 
    goals: string[]
  ): Promise<PersonalizedPlan> {
    try {
      const response = await this.openAIClient.createPersonalizedPlan(userProfile, goals);
      
      if (!response.success || !response.data?.content) {
        throw new Error(response.error || '개인화 계획 생성에 실패했습니다.');
      }

      const planData = safeJsonParse<Partial<PersonalizedPlan>>(response.data.content);
      if (!planData) {
        throw new Error('AI 응답을 파싱할 수 없습니다.');
      }

      const plan: PersonalizedPlan = {
        id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: userProfile.userId,
        title: planData.title || '개인화된 훈련 계획',
        description: planData.description || '',
        duration: planData.duration || 7,
        goals: planData.goals || goals,
        exercises: (planData.exercises || []).map((ex: Partial<PersonalizedExercise>, index: number) => ({
          id: `exercise_${index}`,
          type: ex.type || 'reading',
          title: ex.title || '',
          description: ex.description || '',
          duration: ex.duration || 15,
          difficulty: ex.difficulty || 'intermediate',
          materials: ex.materials || [],
          instructions: ex.instructions || [],
          expectedOutcome: ex.expectedOutcome || ''
        })),
        schedule: planData.schedule || {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.plans.set(plan.id, plan);
      return plan;
    } catch (error) {
      console.error('Personalized plan creation failed:', error);
      throw error;
    }
  }

  async analyzeText(text: string): Promise<NLPResult> {
    try {
      const response = await this.openAIClient.analyzeText(text);
      
      if (!response.success || !response.data?.content) {
        throw new Error(response.error || '텍스트 분석에 실패했습니다.');
      }

      const analysisData = safeJsonParse<Partial<NLPResult>>(response.data.content);
      if (!analysisData) {
        throw new Error('AI 응답을 파싱할 수 없습니다.');
      }

      const nlpResult: NLPResult = {
        sentiment: analysisData.sentiment || 'neutral',
        keywords: analysisData.keywords || [],
        topics: analysisData.topics || [],
        readingLevel: analysisData.readingLevel || 'middle',
        complexity: analysisData.complexity || 0.5,
        summary: analysisData.summary || '',
        questions: analysisData.questions || []
      };

      return nlpResult;
    } catch (error) {
      console.error('Text analysis failed:', error);
      throw error;
    }
  }

  getSessionAnalysis(analysisId: string): SessionAnalysis | undefined {
    return this.analyses.get(analysisId);
  }

  getFeedback(sessionId: string): AIFeedback | undefined {
    return this.feedbacks.get(sessionId);
  }

  getRecommendations(userId: string): ContentRecommendation[] {
    return this.recommendations.get(userId) || [];
  }

  getPersonalizedPlan(planId: string): PersonalizedPlan | undefined {
    return this.plans.get(planId);
  }

  getUserPlans(userId: string): PersonalizedPlan[] {
    return Array.from(this.plans.values()).filter(plan => plan.userId === userId);
  }

  updatePersonalizedPlan(planId: string, updates: Partial<PersonalizedPlan>): void {
    const plan = this.plans.get(planId);
    if (plan) {
      const updatedPlan = { ...plan, ...updates, updatedAt: new Date() };
      this.plans.set(planId, updatedPlan);
    }
  }

  deletePersonalizedPlan(planId: string): boolean {
    return this.plans.delete(planId);
  }

  // 통계 및 분석 유틸리티 메서드들
  calculateProgressTrend(sessionHistory: Session[]): {
    wpmTrend: number;
    accuracyTrend: number;
    consistency: number;
  } {
    if (sessionHistory.length < 2) {
      return { wpmTrend: 0, accuracyTrend: 0, consistency: 0 };
    }

    const recentSessions = sessionHistory.slice(-10);
    const wpmValues = recentSessions.map(s => s.wpm);
    const accuracyValues = recentSessions.map(s => s.accuracy);

    const wpmTrend = this.calculateTrend(wpmValues);
    const accuracyTrend = this.calculateTrend(accuracyValues);
    const consistency = this.calculateConsistency(recentSessions);

    return { wpmTrend, accuracyTrend, consistency };
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, index) => sum + (index * val), 0);
    const sumX2 = values.reduce((sum, _, index) => sum + (index * index), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private calculateConsistency(sessions: Session[]): number {
    if (sessions.length < 2) return 0;
    
    const wpmValues = sessions.map(s => s.wpm);
    const mean = wpmValues.reduce((sum, val) => sum + val, 0) / wpmValues.length;
    const variance = wpmValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / wpmValues.length;
    const standardDeviation = Math.sqrt(variance);
    
    // 일관성은 표준편차의 역수로 계산 (낮을수록 일관성 높음)
    return 1 / (1 + standardDeviation / mean);
  }

  identifyWeaknesses(sessionHistory: Session[]): string[] {
    const weaknesses: { [key: string]: number } = {};
    
    if (sessionHistory.length === 0) return Object.keys(weaknesses).sort((a, b) => weaknesses[b] - weaknesses[a]);

    const recentSessions = sessionHistory.slice(-5);
    const avgWpm = recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length;
    const avgAccuracy = recentSessions.reduce((sum, s) => sum + s.accuracy, 0) / recentSessions.length;

    if (avgWpm < 200) {
      weaknesses['느린 속도'] = 1;
    }
    if (avgAccuracy < 80) {
      weaknesses['정확도 부족'] = 1;
    }

    const consistency = this.calculateConsistency(recentSessions);
    if (consistency < 0.7) {
      weaknesses['일관성 부족'] = 1;
    }

    return Object.keys(weaknesses).sort((a, b) => weaknesses[b] - weaknesses[a]);
  }

  suggestGoals(sessionHistory: Session[], userProfile: UserProfile): string[] {
    const weaknesses = this.identifyWeaknesses(sessionHistory);
    const goals: string[] = [];

    if (weaknesses.includes('느린 속도')) {
      goals.push('WPM 300 달성하기');
    }
    if (weaknesses.includes('정확도 부족')) {
      goals.push('정확도 90% 이상 유지하기');
    }
    if (weaknesses.includes('일관성 부족')) {
      goals.push('안정적인 성과 유지하기');
    }

    // 사용자 레벨에 따른 목표 추가
    if (userProfile.currentLevel === 'beginner') {
      goals.push('기본 속발음 기법 마스터하기');
    } else if (userProfile.currentLevel === 'intermediate') {
      goals.push('고급 속발음 기법 학습하기');
    } else {
      goals.push('전문가 수준의 속발음 능력 달성하기');
    }

    return goals;
  }
}

export const createAnalysisService = (openAIClient: OpenAIClient): AnalysisService => {
  return new AnalysisService(openAIClient);
}; 