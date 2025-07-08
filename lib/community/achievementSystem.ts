import { Achievement } from '@prisma/client';
import { Session } from '@/lib/types'; // Assuming Session type is in lib/types

export interface AchievementDefinition extends Achievement {
  category: string;
  criteria: { [key: string]: number };
  progress: number;
  current: number;
  target: number;
  unit: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'rare' | 'epic' | 'legendary';
  requirements: {
    type: string;
    value: number;
    description: string;
  }[];
}


// 성취 목록 정의
export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first-session',
    userId: '', // placeholder
    type: 'milestone', // placeholder
    unlockedAt: new Date(), // placeholder
    title: '첫 번째 세션',
    description: '첫 번째 독서 세션을 완료했습니다',
    icon: '🎯',
    category: 'milestone',
    criteria: { sessions: 1 },
    progress: 0,
    current: 0,
    target: 1,
    unit: '세션'
  },
  {
    id: 'speed-reader',
    userId: '', // placeholder
    type: 'speed', // placeholder
    unlockedAt: new Date(), // placeholder
    title: '속독가',
    description: '분당 100단어 이상 읽기',
    icon: '⚡',
    category: 'speed',
    criteria: { wpm: 100 },
    progress: 0,
    current: 0,
    target: 100,
    unit: 'WPM'
  },
  {
    id: 'speed-master',
    userId: '', // placeholder
    type: 'speed', // placeholder
    unlockedAt: new Date(), // placeholder
    title: '속독 마스터',
    description: '분당 200단어 이상 읽기',
    icon: '🚀',
    category: 'speed',
    criteria: { wpm: 200 },
    progress: 0,
    current: 0,
    target: 200,
    unit: 'WPM'
  },
  {
    id: 'accuracy-expert',
    userId: '', // placeholder
    type: 'accuracy', // placeholder
    unlockedAt: new Date(), // placeholder
    title: '정확도 전문가',
    description: '90% 이상의 정확도 달성',
    icon: '🎯',
    category: 'accuracy',
    criteria: { accuracy: 90 },
    progress: 0,
    current: 0,
    target: 90,
    unit: '%'
  },
  {
    id: 'consistency-7',
    userId: '', // placeholder
    type: 'consistency', // placeholder
    unlockedAt: new Date(), // placeholder
    title: '일주일 연속',
    description: '7일 연속으로 독서하기',
    icon: '🔥',
    category: 'consistency',
    criteria: { streak: 7 },
    progress: 0,
    current: 0,
    target: 7,
    unit: '일'
  },
  {
    id: 'consistency-30',
    userId: '', // placeholder
    type: 'consistency', // placeholder
    unlockedAt: new Date(), // placeholder
    title: '한 달 연속',
    description: '30일 연속으로 독서하기',
    icon: '💪',
    category: 'consistency',
    criteria: { streak: 30 },
    progress: 0,
    current: 0,
    target: 30,
    unit: '일'
  },
  {
    id: 'session-10',
    userId: '', // placeholder
    type: 'milestone', // placeholder
    unlockedAt: new Date(), // placeholder
    title: '열심히 하는 독서가',
    description: '10회 세션 완료',
    icon: '📚',
    category: 'milestone',
    criteria: { sessions: 10 },
    progress: 0,
    current: 0,
    target: 10,
    unit: '세션'
  },
  {
    id: 'session-50',
    userId: '', // placeholder
    type: 'milestone', // placeholder
    unlockedAt: new Date(), // placeholder
    title: '꾸준한 독서가',
    description: '50회 세션 완료',
    icon: '📖',
    category: 'milestone',
    criteria: { sessions: 50 },
    progress: 0,
    current: 0,
    target: 50,
    unit: '세션'
  },
  {
    id: 'time-600',
    userId: '', // placeholder
    type: 'milestone', // placeholder
    unlockedAt: new Date(), // placeholder
    title: '시간 투자자',
    description: '총 10시간 독서하기',
    icon: '⏰',
    category: 'milestone',
    criteria: { sessions: 600 },
    progress: 0,
    current: 0,
    target: 600, // 10시간 = 600분
    unit: '분'
  }
];

// 배지 목록 정의
export const BADGES: Badge[] = [
  {
    id: 'early-adopter',
    name: '얼리 어답터',
    description: '서비스 초기 사용자',
    icon: '🌟',
    rarity: 'rare',
    requirements: [
      {
        type: 'sessions',
        value: 1,
        description: '첫 번째 세션 완료'
      }
    ]
  },
  {
    id: 'speed-demon',
    name: '속도의 악마',
    description: '빠른 독서 속도 달성',
    icon: '⚡',
    rarity: 'epic',
    requirements: [
      {
        type: 'wpm',
        value: 150,
        description: '분당 150단어 이상'
      }
    ]
  },
  {
    id: 'accuracy-master',
    name: '정확도 마스터',
    description: '높은 정확도 달성',
    icon: '🎯',
    rarity: 'epic',
    requirements: [
      {
        type: 'accuracy',
        value: 95,
        description: '95% 이상 정확도'
      }
    ]
  },
  {
    id: 'streak-champion',
    name: '연속 챔피언',
    description: '긴 연속 기록 달성',
    icon: '🔥',
    rarity: 'legendary',
    requirements: [
      {
        type: 'streak',
        value: 50,
        description: '50일 연속'
      }
    ]
  },
  {
    id: 'time-investor',
    name: '시간 투자자',
    description: '많은 시간 투자',
    icon: '⏰',
    rarity: 'rare',
    requirements: [
      {
        type: 'time',
        value: 1800,
        description: '총 30시간 독서'
      }
    ]
  }
];

// 성취 업데이트 함수
export function updateAchievements(sessions: Session[]): AchievementDefinition[] {
  const updatedAchievements = JSON.parse(JSON.stringify(ACHIEVEMENTS));
  
  if (sessions.length === 0) return updatedAchievements;

  // 통계 계산
  const totalSessions = sessions.length;
  const maxWPM = Math.max(...sessions.map(s => s.wpm));
  const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
  
  // 연속 기록 계산 (간단한 구현)
  let currentStreak = 1;
  for (let i = sessions.length - 1; i > 0; i--) {
    const currentDate = new Date(sessions[i].date);
    const prevDate = new Date(sessions[i-1].date);
    const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
    } else if (diffDays > 1) {
      break;
    }
  }

  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);

  // 각 성취 업데이트
  updatedAchievements.forEach((achievement: AchievementDefinition) => {
    switch (achievement.id) {
      case 'first-session':
        achievement.current = totalSessions;
        achievement.progress = Math.min(100, (achievement.current / achievement.target) * 100);
        if (achievement.current >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
        break;
        
      case 'speed-reader':
        achievement.current = maxWPM;
        achievement.progress = Math.min(100, (achievement.current / achievement.target) * 100);
        if (achievement.current >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
        break;
        
      case 'speed-master':
        achievement.current = maxWPM;
        achievement.progress = Math.min(100, (achievement.current / achievement.target) * 100);
        if (achievement.current >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
        break;
        
      case 'accuracy-expert':
        achievement.current = avgAccuracy;
        achievement.progress = Math.min(100, (achievement.current / achievement.target) * 100);
        if (achievement.current >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
        break;
        
      case 'consistency-7':
        achievement.current = currentStreak;
        achievement.progress = Math.min(100, (achievement.current / achievement.target) * 100);
        if (achievement.current >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
        break;
        
      case 'consistency-30':
        achievement.current = currentStreak;
        achievement.progress = Math.min(100, (achievement.current / achievement.target) * 100);
        if (achievement.current >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
        break;
        
      case 'session-10':
        achievement.current = totalSessions;
        achievement.progress = Math.min(100, (achievement.current / achievement.target) * 100);
        if (achievement.current >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
        break;
        
      case 'session-50':
        achievement.current = totalSessions;
        achievement.progress = Math.min(100, (achievement.current / achievement.target) * 100);
        if (achievement.current >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
        break;
        
      case 'time-600':
        achievement.current = totalTime;
        achievement.progress = Math.min(100, (achievement.current / achievement.target) * 100);
        if (achievement.current >= achievement.target && !achievement.unlockedAt) {
          achievement.unlockedAt = new Date();
        }
        break;
    }
  });

  return updatedAchievements;
}

// 배지 업데이트 함수
export function updateBadges(sessions: Session[], achievements: AchievementDefinition[]): Badge[] {
  const updatedBadges = JSON.parse(JSON.stringify(BADGES));
  
  if (sessions.length === 0) return updatedBadges;

  // 통계 계산
  const totalSessions = sessions.length;
  const maxWPM = Math.max(...sessions.map(s => s.wpm));
  const avgAccuracy = sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length;
  const totalTime = sessions.reduce((sum, s) => sum + s.duration, 0);
  
  // 연속 기록 계산
  let currentStreak = 1;
  for (let i = sessions.length - 1; i > 0; i--) {
    const currentDate = new Date(sessions[i].date);
    const prevDate = new Date(sessions[i-1].date);
    const diffDays = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  // 각 배지 업데이트
  updatedBadges.forEach((badge: Badge) => {
    badge.requirements.forEach(req => {
      switch (req.type) {
        case 'sessions':
          if (totalSessions >= req.value) { /* empty */ }
          break;
        case 'wpm':
          if (maxWPM >= req.value) { /* empty */ }
          break;
        case 'accuracy':
          if (avgAccuracy >= req.value) { /* empty */ }
          break;
        case 'streak':
          if (currentStreak >= req.value) { /* empty */ }
          break;
        case 'time':
          if (totalTime >= req.value) { /* empty */ }
          break;
        case 'achievement':
          if (achievements.find((a: AchievementDefinition) => a.id === req.description && a.unlockedAt)) {
            /* empty */
          }
          break;
      }
      // UI에 표시될 상태 업데이트가 필요하다면 여기에 추가
    });
  });

  return updatedBadges;
}

// 새로운 성취 확인 함수
export function checkNewAchievements(
  previousAchievements: AchievementDefinition[],
  currentAchievements: AchievementDefinition[]
): AchievementDefinition[] {
  const newAchievements: AchievementDefinition[] = [];
  currentAchievements.forEach((current: AchievementDefinition) => {
    const previous = previousAchievements.find((p: AchievementDefinition) => p.id === current.id);
    if (current.unlockedAt && (!previous || !previous.unlockedAt)) {
      newAchievements.push(current);
    }
  });
  return newAchievements;
}

// 새로운 배지 확인 함수
export function checkNewBadges(
  previousBadges: Badge[],
  currentBadges: Badge[]
): Badge[] {
  const newBadges: Badge[] = [];
  currentBadges.forEach((current: Badge) => {
    const previous = previousBadges.find((p: Badge) => p.id === current.id);
    
    // 이 부분은 실제 배지 획득 로직에 따라 수정 필요
    // 예를 들어, 배지의 모든 요구사항이 충족되었는지 확인
    const allRequirementsMet = current.requirements.every(() => {
        // 여기서 실제 획득 조건을 확인하는 로직이 필요.
        // 이 예제에서는 단순화를 위해 항상 참으로 간주
        return true; 
    });

    if (allRequirementsMet && (!previous /* 또는 이전 상태에 대한 다른 조건 */)) {
      newBadges.push(current);
    }
  });
  return newBadges;
} 