import type { 
  UserProfile, 
  TrainingPlan, 
  WeeklyGoal, 
  Exercise,
  WeaknessAnalysis,
  SessionRecord 
} from '@/components/PersonalizedTraining/types';

// 기본 연습 목록
const BASIC_EXERCISES: Exercise[] = [
  {
    id: 'basic-speed',
    title: '기본 속도 연습',
    description: '천천히 시작해서 점진적으로 속도를 높이는 연습',
    type: 'speed',
    difficulty: 'beginner',
    duration: 10,
    content: '간단한 문장들을 천천히 읽으면서 속도를 점진적으로 높여보세요.',
    instructions: [
      '편안한 자세로 앉으세요',
      '천천히 읽기 시작하세요',
      '점진적으로 속도를 높이세요',
      '이해도를 유지하면서 속도만 높이세요'
    ],
    targetMetrics: {
      wpm: 80,
      accuracy: 85
    }
  },
  {
    id: 'basic-accuracy',
    title: '기본 정확도 연습',
    description: '정확한 발음과 이해를 중점으로 하는 연습',
    type: 'accuracy',
    difficulty: 'beginner',
    duration: 15,
    content: '정확한 발음과 이해를 중점으로 하는 연습입니다.',
    instructions: [
      '각 단어를 명확하게 발음하세요',
      '문장의 의미를 이해하면서 읽으세요',
      '오류가 발생하면 다시 읽어보세요',
      '천천히 정확하게 읽는 것을 우선하세요'
    ],
    targetMetrics: {
      accuracy: 90,
      comprehension: 80
    }
  },
  {
    id: 'intermediate-speed',
    title: '중급 속도 연습',
    description: '더 빠른 속도로 읽기 연습',
    type: 'speed',
    difficulty: 'intermediate',
    duration: 20,
    content: '중급 수준의 속도 연습입니다.',
    instructions: [
      '적당한 속도로 읽기 시작하세요',
      '리듬감을 유지하면서 읽으세요',
      '불필요한 정지 없이 읽으세요',
      '자연스러운 흐름을 만들어보세요'
    ],
    targetMetrics: {
      wpm: 150,
      accuracy: 80
    }
  },
  {
    id: 'intermediate-accuracy',
    title: '중급 정확도 연습',
    description: '고정확도 유지 연습',
    type: 'accuracy',
    difficulty: 'intermediate',
    duration: 25,
    content: '중급 수준의 정확도 연습입니다.',
    instructions: [
      '정확한 발음을 유지하세요',
      '문장 구조를 파악하면서 읽으세요',
      '의미 단위로 끊어 읽으세요',
      '오류를 최소화하세요'
    ],
    targetMetrics: {
      accuracy: 95,
      comprehension: 85
    }
  },
  {
    id: 'advanced-speed',
    title: '고급 속도 연습',
    description: '고속 읽기 연습',
    type: 'speed',
    difficulty: 'advanced',
    duration: 30,
    content: '고급 수준의 속도 연습입니다.',
    instructions: [
      '빠른 속도로 읽기 시작하세요',
      '눈의 움직임을 최적화하세요',
      '불필요한 되돌아보기를 줄이세요',
      '고속에서도 이해도를 유지하세요'
    ],
    targetMetrics: {
      wpm: 250,
      accuracy: 75
    }
  },
  {
    id: 'advanced-accuracy',
    title: '고급 정확도 연습',
    description: '극한 정확도 연습',
    type: 'accuracy',
    difficulty: 'advanced',
    duration: 35,
    content: '고급 수준의 정확도 연습입니다.',
    instructions: [
      '완벽한 발음을 목표로 하세요',
      '복잡한 문장도 정확히 읽으세요',
      '의미를 완전히 이해하면서 읽으세요',
      '오류 없는 읽기를 지향하세요'
    ],
    targetMetrics: {
      accuracy: 98,
      comprehension: 90
    }
  }
];

// 약점 분석 생성
function generateWeaknessAnalysis(sessions: SessionRecord[]): WeaknessAnalysis {
  if (sessions.length === 0) {
    return {
      id: 'default-weakness',
      userId: '',
      weaknesses: [{
        type: 'speed',
        severity: 'medium',
        description: '기본적인 속도 연습이 필요합니다.',
        impact: 50,
        suggestedExercises: ['basic-speed']
      }],
      recommendations: ['기본 속도 연습부터 시작하세요.'],
      priority: 'medium',
      createdAt: new Date()
    };
  }

  const avgWPM = sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length;
  const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
  const avgComprehension = sessions.reduce((sum, s) => sum + s.comprehension, 0) / sessions.length;

  const weaknesses: WeaknessAnalysis['weaknesses'] = [];

  // 속도 약점
  if (avgWPM < 100) {
    weaknesses.push({
      type: 'speed',
      severity: avgWPM < 80 ? 'high' : 'medium',
      description: '읽기 속도가 낮습니다. 속도 연습이 필요합니다.',
      impact: Math.max(30, 100 - avgWPM),
      suggestedExercises: ['basic-speed', 'intermediate-speed']
    });
  }

  // 정확도 약점
  if (avgAccuracy < 85) {
    weaknesses.push({
      type: 'accuracy',
      severity: avgAccuracy < 75 ? 'high' : 'medium',
      description: '읽기 정확도가 낮습니다. 정확도 연습이 필요합니다.',
      impact: Math.max(30, 100 - avgAccuracy),
      suggestedExercises: ['basic-accuracy', 'intermediate-accuracy']
    });
  }

  // 일관성 약점
  const wpmVariance = Math.sqrt(
    sessions.reduce((sum, s) => sum + Math.pow(s.wpm - avgWPM, 2), 0) / sessions.length
  );
  if (wpmVariance > 30) {
    weaknesses.push({
      type: 'consistency',
      severity: wpmVariance > 50 ? 'high' : 'medium',
      description: '읽기 속도가 일정하지 않습니다. 일관성 연습이 필요합니다.',
      impact: Math.min(80, wpmVariance),
      suggestedExercises: ['intermediate-speed', 'advanced-speed']
    });
  }

  // 이해도 약점
  if (avgComprehension < 80) {
    weaknesses.push({
      type: 'comprehension',
      severity: avgComprehension < 70 ? 'high' : 'medium',
      description: '읽은 내용의 이해도가 낮습니다. 이해도 향상 연습이 필요합니다.',
      impact: Math.max(30, 100 - avgComprehension),
      suggestedExercises: ['basic-accuracy', 'intermediate-accuracy']
    });
  }

  return {
    id: `weakness-${Date.now()}`,
    userId: '',
    weaknesses,
    recommendations: weaknesses.map(w => `${w.description} ${w.suggestedExercises.join(', ')} 연습을 권장합니다.`),
    priority: weaknesses.some(w => w.severity === 'high') ? 'high' : 'medium',
    createdAt: new Date()
  };
}

// 추천 기법 생성
function getRecommendedTechniques(weaknesses: WeaknessAnalysis[]): string[] {
  const techniqueMap: Record<string, string[]> = {
    'speed': ['스캐닝', '스키밍', '청킹'],
    'accuracy': ['포인팅', '페이싱', '서브보컬라이제이션 제거'],
    'comprehension': ['예측 읽기', '질문 만들기', '요약하기'],
    'consistency': ['메트로놈 사용', '리듬 연습', '속도 조절']
  };

  return weaknesses.flatMap(weakness => 
    weakness.weaknesses.flatMap(w => techniqueMap[w.type] || [])
  );
}

// 개인화된 훈련 계획 생성
export function generatePersonalizedPlan(
  sessions: SessionRecord[],
  userId: string,
  duration: number = 4 // 주 단위
): TrainingPlan {
  const weaknesses = [generateWeaknessAnalysis(sessions)];
  
  // 약점 우선순위 정렬
  const sortedWeaknesses = weaknesses
    .flatMap(w => w.weaknesses)
    .sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      return impactOrder[b.severity] - impactOrder[a.severity];
    });

  // 주별 목표 설정
  const weeklyGoals: WeeklyGoal[] = sortedWeaknesses
    .slice(0, duration)
    .map((weakness, index) => ({
      week: index + 1,
      focus: `${weakness.type} 개선`,
      exercises: BASIC_EXERCISES.filter(exercise => 
        exercise.type === weakness.type || 
        exercise.description.toLowerCase().includes(weakness.type.toLowerCase())
      ),
      targetWPM: weakness.type === 'speed' ? 120 : 100,
      targetAccuracy: weakness.type === 'accuracy' ? 90 : 85
    }));

  // 목표 설정
  const goals = [
    {
      id: 'wpm-goal',
      title: '읽기 속도 향상',
      description: '분당 읽는 단어 수를 향상시킵니다.',
      target: 150,
      current: sessions.length > 0 ? Math.max(...sessions.map(s => s.wpm)) : 0,
      unit: 'WPM',
      achieved: false
    },
    {
      id: 'accuracy-goal',
      title: '읽기 정확도 향상',
      description: '읽기 정확도를 향상시킵니다.',
      target: 90,
      current: sessions.length > 0 ? Math.max(...sessions.map(s => s.accuracy)) : 0,
      unit: '%',
      achieved: false
    }
  ];

  // 스케줄 설정
  const schedule = {
    frequency: 'weekly' as const,
    sessionsPerWeek: 3,
    durationPerSession: 20,
    preferredTime: '18:00',
    daysOfWeek: [1, 3, 5] // 월, 수, 금
  };

  return {
    id: `plan-${Date.now()}`,
    userId,
    title: '개인화된 훈련 계획',
    description: '사용자의 약점을 분석하여 만든 맞춤형 훈련 계획입니다.',
    goals,
    exercises: BASIC_EXERCISES,
    schedule,
    progress: 0,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
    duration,
    estimatedImprovement: 25
  };
}

// 주별 계획 상세 생성
export function generateWeeklyPlan(
  weekNumber: number,
  focus: string,
  exercises: Exercise[]
): WeeklyGoal {
  return {
    week: weekNumber,
    focus,
    exercises,
    targetWPM: 120,
    targetAccuracy: 85
  };
}

// 연습 난이도 조정
export function adjustExerciseDifficulty(
  exercise: Exercise,
  userLevel: 'beginner' | 'intermediate' | 'advanced'
): Exercise {
  const difficultyMap = {
    beginner: { wpm: 80, accuracy: 85 },
    intermediate: { wpm: 150, accuracy: 90 },
    advanced: { wpm: 250, accuracy: 95 }
  };

  const target = difficultyMap[userLevel];

  return {
    ...exercise,
    targetMetrics: {
      wpm: target.wpm,
      accuracy: target.accuracy
    }
  };
} 