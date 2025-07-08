import type { 
  UserProfile, 
  RecommendedContent, 
  GoalSuggestion,
  WeaknessAnalysis,
  SessionRecord,
  ContentRecommendation
} from '@/components/PersonalizedTraining/types';

const CONTENT_DATABASE: RecommendedContent[] = [
  // 초급 콘텐츠
  {
    id: 'text-beginner-1',
    title: '간단한 뉴스 기사',
    type: 'text',
    difficulty: 'beginner',
    description: '일상적인 주제의 짧은 뉴스 기사로 기본 읽기 연습',
    estimatedTime: 10,
    tags: ['뉴스', '일상', '기본'],
    reason: '초급자에게 적합한 간단한 구조의 텍스트'
  },
  {
    id: 'exercise-beginner-1',
    title: '시각적 읽기 기초 연습',
    type: 'exercise',
    difficulty: 'beginner',
    description: '입술을 고정하고 눈으로만 읽는 기본 연습',
    estimatedTime: 15,
    tags: ['시각적 읽기', '기초', '입술 고정'],
    reason: '속발음 해결의 첫 번째 단계'
  },
  
  // 중급 콘텐츠
  {
    id: 'text-intermediate-1',
    title: '기술 블로그 포스트',
    type: 'text',
    difficulty: 'intermediate',
    description: 'IT 관련 기술 블로그로 중간 난이도 읽기 연습',
    estimatedTime: 20,
    tags: ['기술', '블로그', '중급'],
    reason: '중급자에게 적합한 전문적이지만 이해하기 쉬운 콘텐츠'
  },
  {
    id: 'exercise-intermediate-1',
    title: '메트로놈 리듬 읽기',
    type: 'exercise',
    difficulty: 'intermediate',
    description: '메트로놈을 사용하여 일정한 속도로 읽기',
    estimatedTime: 25,
    tags: ['메트로놈', '리듬', '속도'],
    reason: '읽기 속도의 일관성 향상'
  },
  
  // 고급 콘텐츠
  {
    id: 'text-advanced-1',
    title: '학술 논문 요약',
    type: 'text',
    difficulty: 'advanced',
    description: '복잡한 구조의 학술 논문으로 고급 읽기 연습',
    estimatedTime: 30,
    tags: ['학술', '논문', '고급'],
    reason: '고급자에게 적합한 복잡한 구조의 텍스트'
  },
  {
    id: 'exercise-advanced-1',
    title: '스캔 읽기 마스터',
    type: 'exercise',
    difficulty: 'advanced',
    description: '텍스트를 빠르게 스캔하여 핵심 정보 추출',
    estimatedTime: 35,
    tags: ['스캔', '고급', '정보 추출'],
    reason: '고속 읽기의 최고 수준 연습'
  }
];

export function recommendContent(
  userProfile: UserProfile,
  weaknesses: WeaknessAnalysis[],
  sessions: SessionRecord[]
): RecommendedContent[] {
  const recommendations: RecommendedContent[] = [];
  
  // 난이도 기반 필터링
  let filteredContent = CONTENT_DATABASE.filter(content => 
    content.difficulty === userProfile.currentLevel ||
    (userProfile.currentLevel === 'beginner' && content.difficulty === 'beginner') ||
    (userProfile.currentLevel === 'intermediate' && ['beginner', 'intermediate'].includes(content.difficulty)) ||
    (userProfile.currentLevel === 'advanced')
  );

  // 약점 기반 우선순위 부여
  const weaknessTags = getWeaknessTags(weaknesses);
  const contentWithScores = filteredContent.map(content => ({
    content,
    score: calculateContentScore(content, userProfile, weaknessTags, sessions)
  }));

  // 점수 순으로 정렬하여 상위 5개 추천
  return contentWithScores
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(item => ({
      ...item.content,
      reason: generateRecommendationReason(item.content, userProfile, weaknesses)
    }));
}

export function generateGoalSuggestions(
  userProfile: UserProfile,
  sessions: SessionRecord[]
): GoalSuggestion[] {
  const suggestions: GoalSuggestion[] = [];
  
  // 단기 목표 (1-2주)
  const currentWPM = userProfile.currentWPM;
  const targetWPM = userProfile.targetWPM;
  const wpmGap = targetWPM - currentWPM;
  
  if (wpmGap > 0) {
    const shortTermTarget = Math.min(targetWPM, currentWPM + (wpmGap * 0.2));
    suggestions.push({
      id: 'short-term-wpm',
      type: 'short-term',
      title: '읽기 속도 단기 목표',
      description: '2주 내 읽기 속도 향상',
      targetValue: shortTermTarget,
      currentValue: currentWPM,
      unit: 'WPM',
      timeframe: '2주',
      priority: 'high'
    });
  }

  // 중기 목표 (1-2개월)
  const mediumTermTarget = Math.min(targetWPM, currentWPM + (wpmGap * 0.6));
  suggestions.push({
    id: 'medium-term-wpm',
    type: 'medium-term',
    title: '읽기 속도 중기 목표',
    description: '1-2개월 내 목표 속도의 60% 달성',
    targetValue: mediumTermTarget,
    currentValue: currentWPM,
    unit: 'WPM',
    timeframe: '1-2개월',
    priority: 'medium'
  });

  // 장기 목표 (3-6개월)
  suggestions.push({
    id: 'long-term-wpm',
    type: 'long-term',
    title: '최종 목표 달성',
    description: '목표 읽기 속도 달성',
    targetValue: targetWPM,
    currentValue: currentWPM,
    unit: 'WPM',
    timeframe: '3-6개월',
    priority: 'high'
  });

  // 정확도 목표
  if (userProfile.averageAccuracy < 90) {
    suggestions.push({
      id: 'accuracy-goal',
      type: 'medium-term',
      title: '정확도 향상',
      description: '읽기 정확도 90% 달성',
      targetValue: 90,
      currentValue: userProfile.averageAccuracy,
      unit: '%',
      timeframe: '1개월',
      priority: 'medium'
    });
  }

  // 연습 빈도 목표
  const currentFrequency = sessions.length > 0 ? 
    Math.round(sessions.length / Math.max(1, Math.ceil((Date.now() - new Date(sessions[0].date).getTime()) / (1000 * 60 * 60 * 24 * 7)))) : 0;
  
  if (currentFrequency < userProfile.practiceFrequency) {
    suggestions.push({
      id: 'frequency-goal',
      type: 'short-term',
      title: '연습 빈도 증가',
      description: '주간 연습 빈도 목표 달성',
      targetValue: userProfile.practiceFrequency,
      currentValue: currentFrequency,
      unit: '회/주',
      timeframe: '2주',
      priority: 'medium'
    });
  }

  return suggestions;
}

function getWeaknessTags(weaknesses: WeaknessAnalysis[]): string[] {
  const tagMap: Record<string, string[]> = {
    '정확도': ['이해도', '분석', '천천히'],
    '일관성': ['리듬', '속도', '메트로놈'],
    '기법 다양성': ['다양한 기법', '새로운 방법', '실험']
  };

  return weaknesses.flatMap(weakness => tagMap[weakness.area ?? ''] || []);
}

function calculateContentScore(
  content: RecommendedContent,
  userProfile: UserProfile,
  weaknessTags: string[],
  sessions: SessionRecord[]
): number {
  let score = 0;

  // 난이도 적합성
  const levelScore = content.difficulty === userProfile.currentLevel ? 10 : 5;
  score += levelScore;

  // 약점 관련성
  const weaknessRelevance = weaknessTags.some(tag => 
    content.description.includes(tag) || content.tags.some(contentTag => 
      contentTag.includes(tag)
    )
  );
  if (weaknessRelevance) score += 15;

  // 시간 적합성
  const timeFit = content.estimatedTime <= userProfile.availableTime ? 10 : 5;
  score += timeFit;

  // 사용된 기법과의 연관성
  const usedTechniques = sessions.flatMap(s => s.techniques);
  const techniqueOverlap = content.tags.some(tag => 
    usedTechniques.some(tech => tag && tech ? tag.includes(tech) : false)
  );
  if (techniqueOverlap) score += 8;

  // 콘텐츠 타입 다양성
  const contentTypeBonus = content.type === 'exercise' ? 5 : 3;
  score += contentTypeBonus;

  return score;
}

function generateRecommendationReason(
  content: RecommendedContent,
  userProfile: UserProfile,
  weaknesses: WeaknessAnalysis[]
): string {
  const reasons: string[] = [];

  // 난이도 기반 이유
  if (content.difficulty === userProfile.currentLevel) {
    reasons.push('현재 레벨에 적합한 콘텐츠입니다.');
  }

  // 약점 기반 이유
  weaknesses.forEach(weakness => {
    if (
      (content.description && weakness.area && content.description.includes(weakness.area)) ||
      (content.tags && weakness.area && content.tags.some(tag => tag.includes(weakness.area ?? '')))
    ) {
      reasons.push(`${weakness.area} 개선에 도움이 됩니다.`);
    }
  });

  // 시간 기반 이유
  if (content.estimatedTime <= userProfile.availableTime) {
    reasons.push('가용 시간에 맞는 연습입니다.');
  }

  return reasons.length > 0 ? reasons.join(' ') : '개인화된 추천 콘텐츠입니다.';
}

// 콘텐츠 추천 시스템
export class ContentRecommender {
  private contentDatabase: ContentRecommendation[] = [];

  constructor() {
    this.initializeContentDatabase();
  }

  // 콘텐츠 데이터베이스 초기화
  private initializeContentDatabase() {
    this.contentDatabase = [
      {
        id: 'speed-basics',
        userId: '',
        title: '속독 기초 다지기',
        description: '속독의 기본 원리와 기법을 배우는 가이드',
        type: 'article',
        difficulty: 'beginner',
        estimatedTime: 15,
        tags: ['속독', '기초', '기법'],
        relevance: 0,
        reason: ''
      },
      {
        id: 'accuracy-focus',
        userId: '',
        title: '정확도 향상 훈련',
        description: '읽기 정확도를 높이는 특별한 연습법',
        type: 'exercise',
        difficulty: 'intermediate',
        estimatedTime: 20,
        tags: ['정확도', '훈련', '연습'],
        relevance: 0,
        reason: ''
      },
      {
        id: 'comprehension-strategies',
        userId: '',
        title: '이해도 향상 전략',
        description: '읽은 내용을 더 잘 이해하는 방법들',
        type: 'technique',
        difficulty: 'advanced',
        estimatedTime: 25,
        tags: ['이해도', '전략', '고급'],
        relevance: 0,
        reason: ''
      }
    ];
  }

  // 개인화된 콘텐츠 추천
  recommendContent(
    sessions: SessionRecord[],
    weaknesses: WeaknessAnalysis[],
    userId: string
  ): ContentRecommendation[] {
    if (sessions.length === 0) {
      return this.getDefaultRecommendations(userId);
    }

    // 사용자 패턴 분석
    const userPatterns = this.analyzeUserPatterns(sessions);
    
    // 약점 기반 추천
    const weaknessBasedRecommendations = this.getWeaknessBasedRecommendations(weaknesses, userId);
    
    // 패턴 기반 추천
    const patternBasedRecommendations = this.getPatternBasedRecommendations(userPatterns, userId);
    
    // 콘텐츠 결합 및 순위 결정
    const allRecommendations = [
      ...weaknessBasedRecommendations,
      ...patternBasedRecommendations
    ];

    // 중복 제거 및 순위 결정
    const uniqueRecommendations = this.removeDuplicates(allRecommendations);
    const rankedRecommendations = this.rankRecommendations(uniqueRecommendations, userPatterns);

    return rankedRecommendations.slice(0, 5); // 상위 5개 반환
  }

  // 사용자 패턴 분석
  private analyzeUserPatterns(sessions: SessionRecord[]) {
    const patterns = {
      averageWPM: 0,
      averageAccuracy: 0,
      averageComprehension: 0,
      preferredTextType: '',
      preferredDifficulty: '',
      sessionFrequency: 0,
      totalTime: 0,
      improvementTrend: 'stable' as 'improving' | 'declining' | 'stable'
    };

    if (sessions.length === 0) return patterns;

    // 기본 통계 계산
    patterns.averageWPM = sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length;
    patterns.averageAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
    patterns.averageComprehension = sessions.reduce((sum, s) => sum + s.comprehension, 0) / sessions.length;
    patterns.totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);

    // 선호 텍스트 타입 분석
    const textTypeCounts: Record<string, number> = {};
    sessions.forEach(s => {
      textTypeCounts[s.textType] = (textTypeCounts[s.textType] || 0) + 1;
    });
    patterns.preferredTextType = Object.entries(textTypeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // 선호 난이도 분석
    const difficultyCounts: Record<string, number> = {};
    sessions.forEach(s => {
      difficultyCounts[s.difficulty] = (difficultyCounts[s.difficulty] || 0) + 1;
    });
    patterns.preferredDifficulty = Object.entries(difficultyCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '';

    // 세션 빈도 계산 (주당 평균)
    const firstSession = new Date(Math.min(...sessions.map(s => new Date(s.date).getTime())));
    const lastSession = new Date(Math.max(...sessions.map(s => new Date(s.date).getTime())));
    const weeksDiff = Math.max(1, (lastSession.getTime() - firstSession.getTime()) / (1000 * 60 * 60 * 24 * 7));
    patterns.sessionFrequency = sessions.length / weeksDiff;

    // 개선 트렌드 분석
    if (sessions.length >= 3) {
      const recentSessions = sessions.slice(-3);
      const olderSessions = sessions.slice(-6, -3);
      
      const recentAvgWPM = recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length;
      const olderAvgWPM = olderSessions.reduce((sum, s) => sum + s.wpm, 0) / olderSessions.length;
      
      if (recentAvgWPM > olderAvgWPM * 1.1) {
        patterns.improvementTrend = 'improving';
      } else if (recentAvgWPM < olderAvgWPM * 0.9) {
        patterns.improvementTrend = 'declining';
      }
    }

    return patterns;
  }

  // 약점 기반 추천
  private getWeaknessBasedRecommendations(weaknesses: WeaknessAnalysis[], userId: string): ContentRecommendation[] {
    const recommendations: ContentRecommendation[] = [];

    // 약점별 태그 매핑
    const tagMap: Record<string, string[]> = {
      'speed': ['속독', '빠르기', '속도'],
      'accuracy': ['정확도', '정확성', '오류'],
      'comprehension': ['이해도', '이해', '의미'],
      'consistency': ['일관성', '꾸준함', '습관']
    };

    weaknesses.forEach(weakness => {
      const relevantTags = weakness.weaknesses.flatMap(w => tagMap[w.type || 'speed'] || []);
      
      const relevantContent = this.contentDatabase.filter(content => 
        relevantTags.some(tag => 
          content.title.includes(tag) || 
          content.description.includes(tag) ||
          content.tags.includes(tag)
        )
      );

      relevantContent.forEach(content => {
        recommendations.push({
          ...content,
          userId,
          relevance: Math.min(100, content.relevance + 30),
          reason: `${weakness.weaknesses[0]?.type || 'speed'} 개선에 도움이 됩니다.`
        });
      });
    });

    return recommendations;
  }

  // 패턴 기반 추천
  private getPatternBasedRecommendations(patterns: any, userId: string): ContentRecommendation[] {
    const recommendations: ContentRecommendation[] = [];

    // WPM 기반 추천
    if (patterns.averageWPM < 100) {
      const speedContent = this.contentDatabase.filter(c => 
        c.tags.includes('속독') || c.tags.includes('빠르기')
      );
      speedContent.forEach(content => {
        recommendations.push({
          ...content,
          userId,
          relevance: Math.min(100, content.relevance + 25),
          reason: '읽기 속도 향상에 도움이 됩니다.'
        });
      });
    }

    // 정확도 기반 추천
    if (patterns.averageAccuracy < 80) {
      const accuracyContent = this.contentDatabase.filter(c => 
        c.tags.includes('정확도') || c.tags.includes('정확성')
      );
      accuracyContent.forEach(content => {
        recommendations.push({
          ...content,
          userId,
          relevance: Math.min(100, content.relevance + 25),
          reason: '읽기 정확도 향상에 도움이 됩니다.'
        });
      });
    }

    // 세션 빈도 기반 추천
    if (patterns.sessionFrequency < 3) {
      const consistencyContent = this.contentDatabase.filter(c => 
        c.tags.includes('일관성') || c.tags.includes('습관')
      );
      consistencyContent.forEach(content => {
        recommendations.push({
          ...content,
          userId,
          relevance: Math.min(100, content.relevance + 20),
          reason: '꾸준한 연습 습관 형성에 도움이 됩니다.'
        });
      });
    }

    return recommendations;
  }

  // 기본 추천 (새 사용자용)
  private getDefaultRecommendations(userId: string): ContentRecommendation[] {
    return this.contentDatabase.slice(0, 3).map(content => ({
      ...content,
      userId,
      relevance: 50,
      reason: '새로운 사용자를 위한 기본 추천 콘텐츠입니다.'
    }));
  }

  // 중복 제거
  private removeDuplicates(recommendations: ContentRecommendation[]): ContentRecommendation[] {
    const seen = new Set<string>();
    return recommendations.filter(rec => {
      if (seen.has(rec.id)) {
        return false;
      }
      seen.add(rec.id);
      return true;
    });
  }

  // 추천 순위 결정
  private rankRecommendations(
    recommendations: ContentRecommendation[], 
    patterns: any
  ): ContentRecommendation[] {
    return recommendations.sort((a, b) => {
      // 관련성 점수
      const relevanceDiff = b.relevance - a.relevance;
      if (Math.abs(relevanceDiff) > 10) return relevanceDiff;

      // 난이도 적합성
      const difficultyScore = (rec: ContentRecommendation) => {
        if (patterns.averageWPM < 100 && rec.difficulty === 'beginner') return 3;
        if (patterns.averageWPM >= 100 && patterns.averageWPM < 200 && rec.difficulty === 'intermediate') return 3;
        if (patterns.averageWPM >= 200 && rec.difficulty === 'advanced') return 3;
        return 1;
      };

      const difficultyDiff = difficultyScore(b) - difficultyScore(a);
      if (difficultyDiff !== 0) return difficultyDiff;

      // 예상 시간 (짧은 것 우선)
      return a.estimatedTime - b.estimatedTime;
    });
  }

  // 콘텐츠 데이터베이스 업데이트
  addContent(content: Omit<ContentRecommendation, 'id' | 'userId' | 'relevance' | 'reason'>) {
    const newContent: ContentRecommendation = {
      ...content,
      id: `content-${Date.now()}`,
      userId: '',
      relevance: 0,
      reason: ''
    };
    this.contentDatabase.push(newContent);
  }

  // 콘텐츠 검색
  searchContent(query: string): ContentRecommendation[] {
    const searchTerm = query.toLowerCase();
    return this.contentDatabase.filter(content =>
      content.title.toLowerCase().includes(searchTerm) ||
      content.description.toLowerCase().includes(searchTerm) ||
      content.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // 콘텐츠 필터링
  filterContent(filters: {
    type?: string;
    difficulty?: string;
    maxTime?: number;
    tags?: string[];
  }): ContentRecommendation[] {
    return this.contentDatabase.filter(content => {
      if (filters.type && content.type !== filters.type) return false;
      if (filters.difficulty && content.difficulty !== filters.difficulty) return false;
      if (filters.maxTime && content.estimatedTime > filters.maxTime) return false;
      if (filters.tags && !filters.tags.some(tag => content.tags.includes(tag))) return false;
      return true;
    });
  }
}

export const contentRecommender = new ContentRecommender(); 