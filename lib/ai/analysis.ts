import { Session, User } from '@/lib/types';

interface AnalysisResult {
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    nextSteps: string[];
  };
  personalizedPlan: {
    exercises: {
      name: string;
      description: string;
      duration: string;
      difficulty: string;
    }[];
    contentRecommendations: {
      title: string;
      type: string;
      difficulty: string;
      estimatedTime: string;
    }[];
  };
}

interface Plan {
  title: string;
  description: string;
  exercises: {
    name: string;
    description: string;
    duration: string;
    difficulty: string;
  }[];
  contentRecommendations: {
    title: string;
    type: string;
    difficulty: string;
    estimatedTime: string;
  }[];
  duration: string;
  difficulty: string;
}

interface Recommendations {
  recommendations: {
    title: string;
    type: string;
    difficulty: string;
    estimatedTime: string;
    description: string;
  }[];
  reason: string;
}

interface PerformanceAnalysis {
  totalSessions: number;
  totalDuration: number;
  averageComprehension: number;
  averageReadingSpeed: number;
  improvement: string;
  predictions: {
    nextWeek: string;
    nextMonth: string;
  };
  trends: {
    comprehension: string;
    speed: string;
    duration: string;
  };
}


// AI 기능 완전 비활성화: 항상 Mock 응답만 반환

export async function analyzeSession(sessionData?: Session, userProfile?: User): Promise<AnalysisResult> {
  console.log('AI 분석 요청:', { sessionData, userProfile });
  
  // Mock 응답 생성
  const mockAnalysis = {
    analysis: {
      strengths: [
        '일관된 읽기 속도를 유지하고 있습니다',
        '노트 작성을 통해 내용을 정리하는 습관이 좋습니다',
        `${sessionData?.duration || 30}분 동안 집중력을 유지했습니다`
      ],
      weaknesses: [
        '읽기 속도가 목표보다 다소 느립니다',
        '이해도 점수가 더 향상될 여지가 있습니다',
        '복잡한 문장에서 속도가 떨어지는 경향이 있습니다'
      ],
      recommendations: [
        '스킬드 리딩 연습을 통해 속도 향상에 집중하세요',
        '키워드 중심의 빠른 스캔 연습을 추가하세요',
        '주기적인 이해도 체크를 통해 학습 효과를 모니터링하세요'
      ],
      nextSteps: [
        '다음 세션에서는 20% 빠른 속도로 읽기 연습',
        '주요 개념을 중심으로 한 요약 연습',
        '일주일 후 이해도 재측정'
      ]
    },
    personalizedPlan: {
      exercises: [
        {
          name: '속도 향상 연습',
          description: '타이머를 사용하여 읽기 속도를 점진적으로 높이는 연습',
          duration: '15분',
          difficulty: '중급'
        },
        {
          name: '이해도 체크',
          description: '읽은 내용을 바탕으로 질문에 답하는 연습',
          duration: '10분',
          difficulty: '초급'
        }
      ],
      contentRecommendations: [
        {
          title: '빠른 읽기 기법',
          type: 'article',
          difficulty: '중급',
          estimatedTime: '20분'
        },
        {
          title: '효과적인 노트 작성법',
          type: 'guide',
          difficulty: '초급',
          estimatedTime: '15분'
        }
      ]
    }
  };

  console.log('AI 분석 완료:', mockAnalysis);
  return mockAnalysis;
}

export async function generatePersonalizedPlan(): Promise<Plan> {
  return {
    title: "개인화된 훈련 계획",
    description: "사용자의 수준과 목표에 맞춘 맞춤형 훈련 계획입니다.",
    exercises: [
      {
        name: "속도 향상 연습",
        description: "타이머를 사용하여 읽기 속도를 점진적으로 높이는 연습",
        duration: "20분",
        difficulty: "중급"
      },
      {
        name: "이해도 체크",
        description: "읽은 내용을 바탕으로 질문에 답하는 연습",
        duration: "15분",
        difficulty: "초급"
      },
      {
        name: "스킬드 리딩",
        description: "특정 정보를 빠르게 찾아내는 연습",
        duration: "10분",
        difficulty: "고급"
      }
    ],
    contentRecommendations: [
      {
        title: "빠른 읽기 기법 가이드",
        type: "article",
        difficulty: "중급",
        estimatedTime: "25분"
      },
      {
        title: "효과적인 노트 작성법",
        type: "guide",
        difficulty: "초급",
        estimatedTime: "20분"
      }
    ],
    duration: "45분",
    difficulty: "중급"
  };
}

export async function recommendContent(): Promise<Recommendations> {
  return {
    recommendations: [
      {
        title: "빠른 읽기 기법 완전 가이드",
        type: "article",
        difficulty: "중급",
        estimatedTime: "30분",
        description: "과학적으로 검증된 빠른 읽기 기법들을 소개합니다."
      },
      {
        title: "집중력 향상을 위한 팁",
        type: "guide",
        difficulty: "초급",
        estimatedTime: "15분",
        description: "읽기 세션 중 집중력을 유지하는 방법을 알려줍니다."
      },
      {
        title: "효과적인 노트 작성 시스템",
        type: "tutorial",
        difficulty: "중급",
        estimatedTime: "25분",
        description: "읽은 내용을 체계적으로 정리하는 노트 작성법을 배워보세요."
      }
    ],
    reason: "사용자의 학습 수준과 목표에 맞춘 맞춤형 콘텐츠를 추천합니다."
  };
}

// 실시간 피드백 생성
export async function generateRealTimeFeedback(
  currentSession: Session
): Promise<string> {
  try {
    console.log('실시간 피드백 생성 시작');
    
    // 현재 세션 데이터를 기반으로 실시간 피드백 생성
    const duration = currentSession?.duration || 0;
    const wordsRead = currentSession?.wordsRead || 0;
    const comprehensionScore = currentSession?.comprehensionScore || 0;
    
    let feedback = '';
    
    if (duration < 15) {
      feedback += '세션 시간이 짧습니다. 더 긴 시간 동안 연습해보세요. ';
    } else if (duration > 60) {
      feedback += '긴 세션을 잘 유지하고 있습니다. 휴식을 취하는 것도 잊지 마세요. ';
    }
    
    if (wordsRead > 0) {
      const readingSpeed = Math.round(wordsRead / (duration / 60));
      if (readingSpeed < 200) {
        feedback += '읽기 속도를 조금 더 높여보세요. ';
      } else if (readingSpeed > 500) {
        feedback += '빠른 속도로 잘 읽고 있습니다. 이해도를 확인해보세요. ';
      }
    }
    
    if (comprehensionScore < 70) {
      feedback += '이해도를 높이기 위해 속도를 조금 낮춰보세요. ';
    } else if (comprehensionScore > 90) {
      feedback += '높은 이해도를 유지하고 있습니다. 속도를 조금 더 높여볼 수 있습니다. ';
    }
    
    if (!feedback) {
      feedback = '좋은 페이스를 유지하고 있습니다. 계속 진행해주세요.';
    }
    
    console.log('실시간 피드백 생성 완료:', feedback);
    return feedback;
  } catch (error) {
    console.error('실시간 피드백 생성 실패:', error);
    return '현재 세션을 계속 진행해주세요.';
  }
}

// 성과 분석 및 예측
export async function analyzePerformance(
  sessionHistory: Session[]
): Promise<PerformanceAnalysis> {
  try {
    console.log('성과 분석 시작:', { sessionHistory });
    
    if (!sessionHistory || sessionHistory.length === 0) {
      return {
        totalSessions: 0,
        totalDuration: 0,
        averageComprehension: 0,
        averageReadingSpeed: 0,
        improvement: '아직 충분한 데이터가 없습니다',
        predictions: {
          nextWeek: '더 많은 세션을 완료하면 예측이 가능합니다',
          nextMonth: '지속적인 연습이 필요합니다'
        },
        trends: {
          comprehension: 'stable',
          speed: 'stable',
          duration: 'stable'
        }
      };
    }
    
    // 세션 히스토리를 바탕으로 성과 분석
    const totalSessions = sessionHistory.length;
    const totalDuration = sessionHistory.reduce((sum, session) => sum + (session.duration || 0), 0);
    const totalWords = sessionHistory.reduce((sum, session) => sum + (session.wordsRead || 0), 0);
    const avgComprehension = sessionHistory.reduce((sum, session) => sum + (session.comprehensionScore || 0), 0) / totalSessions;
    const avgReadingSpeed = totalWords > 0 ? Math.round(totalWords / (totalDuration / 60)) : 0;
    
    // 트렌드 분석 (최근 3개 세션과 이전 3개 세션 비교)
    const recentSessions = sessionHistory.slice(-3);
    const olderSessions = sessionHistory.slice(-6, -3);
    
    let comprehensionTrend = 'stable';
    const speedTrend = 'stable';
    const durationTrend = 'stable';
    
    if (recentSessions.length >= 3 && olderSessions.length >= 3) {
      const recentAvgComp = recentSessions.reduce((sum, s) => sum + (s.comprehensionScore || 0), 0) / 3;
      const olderAvgComp = olderSessions.reduce((sum, s) => sum + (s.comprehensionScore || 0), 0) / 3;
      comprehensionTrend = recentAvgComp > olderAvgComp ? 'improving' : recentAvgComp < olderAvgComp ? 'declining' : 'stable';
    }
    
    const analysis = {
      totalSessions,
      totalDuration,
      totalWords,
      averageComprehension: Math.round(avgComprehension),
      averageReadingSpeed: avgReadingSpeed,
      improvement: avgComprehension > 80 ? '우수한 성과를 보이고 있습니다' : '지속적인 개선이 필요합니다',
      predictions: {
        nextWeek: avgComprehension > 80 ? '약 3-5% 향상 예상' : '약 5-10% 향상 예상',
        nextMonth: avgComprehension > 80 ? '약 10-15% 향상 예상' : '약 15-25% 향상 예상'
      },
      trends: {
        comprehension: comprehensionTrend,
        speed: speedTrend,
        duration: durationTrend
      },
      recommendations: [
        avgComprehension < 70 ? '이해도 향상에 집중하세요' : '속도 향상을 시도해보세요',
        totalSessions < 5 ? '더 많은 세션을 완료하여 데이터를 축적하세요' : '일관된 연습을 계속하세요'
      ]
    };
    
    console.log('성과 분석 완료:', analysis);
    return analysis;
  } catch (error) {
    console.error('성과 분석 실패:', error);
    throw new Error(`성과 분석 실패: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// AI 설정 확인
export function isAIConfigured(): boolean {
  return false; // AI 기능이 비활성화되어 있으므로 항상 false
}

// AI 클라이언트 상태 확인
export function getAIStatus(): {
  configured: boolean;
  model: string;
  maxTokens: number;
} {
  return {
    configured: false,
    model: "unknown",
    maxTokens: 0
  };
} 