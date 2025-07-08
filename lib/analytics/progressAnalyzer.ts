import type { SessionRecord, ProgressStats, ChartDataPoint, LevelDistribution, TechniqueUsage, ProgressAnalysis } from '@/components/Dashboard/types';

export function calculateProgressStats(sessions: SessionRecord[]): ProgressStats {
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      totalTime: 0,
      averageWPM: 0,
      maxWPM: 0,
      averageAccuracy: 0,
      consistencyScore: 0,
      improvementRate: 0,
      practiceDays: 0,
      currentStreak: 0,
    };
  }

  const totalSessions = sessions.length;
  const totalTime = sessions.reduce((sum, session) => sum + session.duration, 0);
  const averageWPM = sessions.reduce((sum, session) => sum + session.wpm, 0) / totalSessions;
  const maxWPM = Math.max(...sessions.map(s => s.wpm));
  const averageAccuracy = sessions.reduce((sum, session) => sum + session.accuracy, 0) / totalSessions;

  // 일관성 점수 계산 (표준편차 기반)
  const wpmValues = sessions.map(s => s.wpm);
  const wpmStdDev = calculateStandardDeviation(wpmValues);
  const consistencyScore = Math.max(0, 100 - (wpmStdDev / averageWPM) * 100);

  // 향상도 계산 (최근 5개 세션 vs 이전 5개 세션)
  const improvementRate = calculateImprovementRate(sessions);

  // 연습 일수 계산
  const uniqueDates = new Set(sessions.map(s => s.date));
  const practiceDays = uniqueDates.size;

  // 현재 연속 연습 일수 계산
  const currentStreak = calculateCurrentStreak(sessions);

  return {
    totalSessions,
    totalTime,
    averageWPM: Math.round(averageWPM * 10) / 10,
    maxWPM,
    averageAccuracy: Math.round(averageAccuracy * 10) / 10,
    consistencyScore: Math.round(consistencyScore),
    improvementRate: Math.round(improvementRate * 10) / 10,
    practiceDays,
    currentStreak,
  };
}

export function generateChartData(sessions: SessionRecord[]): ChartDataPoint[] {
  return sessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(session => ({
      date: session.date,
      wpm: session.wpm,
      accuracy: session.accuracy,
      improvement: session.improvement,
    }));
}

export function calculateLevelDistribution(sessions: SessionRecord[]): LevelDistribution {
  const distribution = { beginner: 0, intermediate: 0, advanced: 0 };
  
  sessions.forEach(session => {
    distribution[session.level]++;
  });

  return distribution;
}

export function analyzeTechniqueUsage(sessions: SessionRecord[]): TechniqueUsage[] {
  const techniqueCounts: Record<string, number> = {};
  let totalSessions = 0;

  sessions.forEach(session => {
    session.techniques.forEach(technique => {
      techniqueCounts[technique] = (techniqueCounts[technique] || 0) + 1;
    });
    totalSessions++;
  });

  return Object.entries(techniqueCounts)
    .map(([technique, count]) => ({
      technique,
      count,
      percentage: Math.round((count / totalSessions) * 100),
    }))
    .sort((a, b) => b.count - a.count);
}

export function analyzeRecentTrend(sessions: SessionRecord[]): 'improving' | 'declining' | 'stable' {
  if (sessions.length < 6) return 'stable';

  const sortedSessions = sessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentSessions = sortedSessions.slice(-3);
  const previousSessions = sortedSessions.slice(-6, -3);

  const recentAvgWPM = recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length;
  const previousAvgWPM = previousSessions.reduce((sum, s) => sum + s.wpm, 0) / previousSessions.length;

  const change = ((recentAvgWPM - previousAvgWPM) / previousAvgWPM) * 100;

  if (change > 5) return 'improving';
  if (change < -5) return 'declining';
  return 'stable';
}

export function generateRecommendations(sessions: SessionRecord[], stats: ProgressStats): string[] {
  const recommendations: string[] = [];

  // 일관성 기반 추천
  if (stats.consistencyScore < 70) {
    recommendations.push('일관성 향상을 위해 매일 일정한 시간에 연습하는 것을 권장합니다.');
  }

  // 향상도 기반 추천
  if (stats.improvementRate < 10) {
    recommendations.push('더 다양한 읽기 기법을 시도해보세요.');
  }

  // 연습 빈도 기반 추천
  if (stats.practiceDays < 7) {
    recommendations.push('주 3-4회 이상의 정기적인 연습을 권장합니다.');
  }

  // 정확도 기반 추천
  if (stats.averageAccuracy < 80) {
    recommendations.push('속도보다 정확도에 집중하여 연습해보세요.');
  }

  // 최근 트렌드 기반 추천
  const recentTrend = analyzeRecentTrend(sessions);
  if (recentTrend === 'declining') {
    recommendations.push('최근 성과가 하락하고 있습니다. 훈련 방법을 점검해보세요.');
  }

  return recommendations;
}

export function analyzeProgress(sessions: SessionRecord[]): ProgressAnalysis {
  const stats = calculateProgressStats(sessions);
  const chartData = generateChartData(sessions);
  const levelDistribution = calculateLevelDistribution(sessions);
  const techniqueUsage = analyzeTechniqueUsage(sessions);
  const recentTrend = analyzeRecentTrend(sessions);
  const recommendations = generateRecommendations(sessions, stats);

  return {
    stats,
    chartData,
    levelDistribution,
    techniqueUsage,
    recentTrend,
    recommendations,
  };
}

// 유틸리티 함수들
function calculateStandardDeviation(values: number[]): number {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance);
}

function calculateImprovementRate(sessions: SessionRecord[]): number {
  if (sessions.length < 10) return 0;

  const sortedSessions = sessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentSessions = sortedSessions.slice(-5);
  const previousSessions = sortedSessions.slice(-10, -5);

  const recentAvgWPM = recentSessions.reduce((sum, s) => sum + s.wpm, 0) / recentSessions.length;
  const previousAvgWPM = previousSessions.reduce((sum, s) => sum + s.wpm, 0) / previousSessions.length;

  return previousAvgWPM > 0 ? ((recentAvgWPM - previousAvgWPM) / previousAvgWPM) * 100 : 0;
}

function calculateCurrentStreak(sessions: SessionRecord[]): number {
  if (sessions.length === 0) return 0;

  const sortedSessions = sessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  let streak = 0;
  let currentDate = new Date(today);

  for (const session of sortedSessions) {
    const sessionDate = new Date(session.date);
    const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 1) {
      streak++;
      currentDate = sessionDate;
    } else {
      break;
    }
  }

  return streak;
} 