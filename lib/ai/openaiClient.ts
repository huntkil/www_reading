import OpenAI from 'openai';
import {
  OpenAIConfig,
  AIResponse,
  UserProfile,
} from './types';
import { Session } from '@/lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIClient {
  private config: OpenAIConfig;

  constructor(config: Partial<OpenAIConfig> = {}) {
    this.config = {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: config.model || 'gpt-4-turbo',
      maxTokens: config.maxTokens || 1024,
      temperature: config.temperature || 0.7,
      ...config,
    };

    if (!this.config.apiKey) {
      throw new Error("OpenAI API key is not configured.");
    }
  }

  private async chatCompletion(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    options?: Partial<OpenAIConfig>
  ): Promise<AIResponse> {
    try {
      const completion = await openai.chat.completions.create({
        model: options?.model || this.config.model,
        messages: messages,
        max_tokens: options?.maxTokens || this.config.maxTokens,
        temperature: options?.temperature || this.config.temperature,
      });

      return {
        success: true,
        data: {
          content: completion.choices[0]?.message?.content,
        },
        usage: completion.usage ?? { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown OpenAI error',
      };
    }
  }

  async analyzeSession(sessionData: Session): Promise<AIResponse> {
    const prompt = this.buildSessionAnalysisPrompt(sessionData);
    return this.chatCompletion([{ role: 'user', content: prompt }]);
  }

  async generateRecommendations(userProfile: UserProfile, sessionHistory: Session[]): Promise<AIResponse> {
    const prompt = this.buildRecommendationPrompt(userProfile, sessionHistory);
    
    const messages = [
      {
        role: 'system' as const,
        content: `당신은 서브보컬라이제이션 학습을 위한 개인화된 콘텐츠 추천 전문가입니다.
        사용자의 프로필과 세션 히스토리를 바탕으로 가장 적합한 학습 콘텐츠를 추천해주세요.
        
        추천 결과는 다음 JSON 형식으로 응답해주세요:
        {
          "recommendations": [
            {
              "type": "text|exercise|technique|goal",
              "title": "제목",
              "description": "설명",
              "difficulty": "beginner|intermediate|advanced",
              "estimatedTime": 30,
              "tags": ["태그1", "태그2"],
              "content": "실제 콘텐츠",
              "reasoning": "추천 이유",
              "confidence": 0.85
            }
          ]
        }`
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];

    return this.chatCompletion(messages);
  }

  async createPersonalizedPlan(userProfile: UserProfile, goals: string[]): Promise<AIResponse> {
    const prompt = this.buildPersonalizedPlanPrompt(userProfile, goals);
    
    const messages = [
      {
        role: 'system' as const,
        content: `당신은 서브보컬라이제이션 학습을 위한 개인화된 훈련 계획 수립 전문가입니다.
        사용자의 프로필과 목표를 바탕으로 실현 가능하고 효과적인 주간 훈련 계획을 만들어주세요.
        
        계획은 다음 JSON 형식으로 응답해주세요:
        {
          "title": "계획 제목",
          "description": "계획 설명",
          "duration": 7,
          "goals": ["목표1", "목표2"],
          "exercises": [
            {
              "type": "reading|breathing|focus|speed|comprehension",
              "title": "운동 제목",
              "description": "운동 설명",
              "duration": 15,
              "difficulty": "beginner|intermediate|advanced",
              "materials": ["재료1", "재료2"],
              "instructions": ["지시사항1", "지시사항2"],
              "expectedOutcome": "예상 결과"
            }
          ],
          "schedule": {
            "monday": [운동ID들],
            "tuesday": [운동ID들],
            ...
          }
        }`
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];

    return this.chatCompletion(messages);
  }

  async analyzeText(text: string): Promise<AIResponse> {
    const prompt = this.buildTextAnalysisPrompt(text);
    
    const messages = [
      {
        role: 'system' as const,
        content: `당신은 텍스트 분석 전문가입니다. 주어진 텍스트의 난이도, 주제, 감정 등을 분석해주세요.
        
        분석 결과는 다음 JSON 형식으로 응답해주세요:
        {
          "sentiment": "positive|negative|neutral",
          "keywords": ["키워드1", "키워드2"],
          "topics": ["주제1", "주제2"],
          "readingLevel": "elementary|middle|high|college",
          "complexity": 0.75,
          "summary": "텍스트 요약",
          "questions": ["질문1", "질문2"]
        }`
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];

    return this.chatCompletion(messages);
  }

  async generateFeedback(sessionData: Session, userProfile: UserProfile): Promise<AIResponse> {
    const prompt = this.buildFeedbackPrompt(sessionData, userProfile);
    
    const messages = [
      {
        role: 'system' as const,
        content: `당신은 서브보컬라이제이션 코치입니다. 사용자의 세션에 대해 격려적이고 구체적인 피드백을 제공해주세요.
        
        피드백은 다음 JSON 형식으로 응답해주세요:
        {
          "feedback": {
            "technical": ["기술적 피드백1", "기술적 피드백2"],
            "emotional": ["감정적 피드백1", "감정적 피드백2"],
            "progress": ["진행상황 피드백1", "진행상황 피드백2"],
            "motivation": ["동기부여 피드백1", "동기부여 피드백2"]
          },
          "suggestions": {
            "immediate": ["즉시 실행 가능한 제안1", "즉시 실행 가능한 제안2"],
            "shortTerm": ["단기 제안1", "단기 제안2"],
            "longTerm": ["장기 제안1", "장기 제안2"]
          },
          "encouragement": "격려 메시지"
        }`
      },
      {
        role: 'user' as const,
        content: prompt
      }
    ];

    return this.chatCompletion(messages);
  }

  private buildSessionAnalysisPrompt(sessionData: Session): string {
    return `
    다음 세션 데이터를 분석해주세요:
    
    세션 정보:
    - 날짜: ${sessionData.date}
    - 지속시간: ${sessionData.duration}분
    - WPM: ${sessionData.wpm}
    - 정확도: ${sessionData.accuracy}%
    - 개선도: ${sessionData.improvement}
    - 사용 기법: ${sessionData.techniques?.join(', ')}
    - 메모: ${sessionData.notes}
    
    이전 세션들과 비교하여 개선점과 강점을 분석하고, 구체적인 피드백을 제공해주세요.
    `;
  }

  private buildRecommendationPrompt(userProfile: UserProfile, sessionHistory: Session[]): string {
    return `
    사용자 프로필:
    - 학습 스타일: ${userProfile.learningStyle}
    - 현재 레벨: ${userProfile.currentLevel}
    - 관심사: ${userProfile.interests?.join(', ')}
    - 목표: ${userProfile.goals?.join(', ')}
    - 하루 사용 가능 시간: ${userProfile.timeAvailability}분
    
    최근 세션 히스토리:
    ${sessionHistory.slice(-5).map(session => 
      `- ${session.date}: WPM ${session.wpm}, 정확도 ${session.accuracy}%`
    ).join('\n')}
    
    이 정보를 바탕으로 개인화된 학습 콘텐츠를 추천해주세요.
    `;
  }

  private buildPersonalizedPlanPrompt(userProfile: UserProfile, goals: string[]): string {
    return `
    사용자 프로필:
    - 학습 스타일: ${userProfile.learningStyle}
    - 현재 레벨: ${userProfile.currentLevel}
    - 관심사: ${userProfile.interests?.join(', ')}
    - 선호 난이도: ${userProfile.preferredDifficulty}
    - 하루 사용 가능 시간: ${userProfile.timeAvailability}분
    
    목표:
    ${goals.map(goal => `- ${goal}`).join('\n')}
    
    이 정보를 바탕으로 7일간의 개인화된 훈련 계획을 만들어주세요.
    `;
  }

  private buildTextAnalysisPrompt(text: string): string {
    return `
    다음 텍스트를 분석해주세요:
    
    "${text}"
    
    텍스트의 난이도, 주제, 감정, 키워드 등을 분석하고, 학습에 도움이 될 수 있는 질문들을 생성해주세요.
    `;
  }

  private buildFeedbackPrompt(sessionData: Session, userProfile: UserProfile): string {
    return `
    사용자 프로필:
    - 학습 스타일: ${userProfile.learningStyle}
    - 현재 레벨: ${userProfile.currentLevel}
    - 목표: ${userProfile.goals?.join(', ')}
    
    세션 데이터:
    - WPM: ${sessionData.wpm}
    - 정확도: ${sessionData.accuracy}%
    - 개선도: ${sessionData.improvement}
    - 메모: ${sessionData.notes}
    
    이 정보를 바탕으로 격려적이고 구체적인 피드백을 제공해주세요.
    `;
  }

  updateConfig(newConfig: Partial<OpenAIConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): OpenAIConfig {
    return { ...this.config };
  }
}

export const createOpenAIClient = (config: OpenAIConfig): OpenAIClient => {
  return new OpenAIClient(config);
}; 