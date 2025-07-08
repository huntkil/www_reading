'use client'

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, Trophy, Star, Target, Clock, TrendingUp, BookOpen, Zap, LucideIcon } from 'lucide-react';

interface Achievement {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  icon: string | null;
  unlockedAt: string;
}

export default function AchievementsPage() {
  const { user, isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAchievements = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/achievement?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAchievements(data.achievements || []);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAchievements();
    }
  }, [isAuthenticated, user, fetchAchievements]);

  // Placeholder achievements for demonstration
  const placeholderAchievements = [
    {
      id: '1',
      type: 'first_session',
      title: '첫 번째 세션',
      description: '첫 번째 읽기 세션을 완료했습니다',
      icon: 'BookOpen',
      unlockedAt: null,
    },
    {
      id: '2',
      type: 'speed_improvement',
      title: '속도 향상',
      description: '읽기 속도를 50% 향상시켰습니다',
      icon: 'TrendingUp',
      unlockedAt: null,
    },
    {
      id: '3',
      type: 'comprehension_master',
      title: '이해도 마스터',
      description: '90% 이상의 이해도를 달성했습니다',
      icon: 'Target',
      unlockedAt: null,
    },
    {
      id: '4',
      type: 'consistency',
      title: '꾸준함',
      description: '7일 연속으로 훈련했습니다',
      icon: 'Clock',
      unlockedAt: null,
    },
    {
      id: '5',
      type: 'word_master',
      title: '단어 마스터',
      description: '10,000단어를 읽었습니다',
      icon: 'Zap',
      unlockedAt: null,
    },
    {
      id: '6',
      type: 'level_up',
      title: '레벨 업',
      description: '중급 레벨에 도달했습니다',
      icon: 'Trophy',
      unlockedAt: null,
    },
  ];

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, LucideIcon> = {
      BookOpen,
      TrendingUp,
      Target,
      Clock,
      Zap,
      Trophy,
      Award,
      Star,
    };
    return icons[iconName] || Award;
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="text-muted-foreground">업적을 확인하려면 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlockedAt);
  const lockedAchievements = placeholderAchievements.filter(
    a => !achievements.some(unlocked => unlocked.type === a.type)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">업적</h1>
        <p className="text-muted-foreground">
          읽기 훈련을 통해 달성한 업적들을 확인해보세요.
        </p>
      </div>

      {/* 업적 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">달성한 업적</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
            <p className="text-xs text-muted-foreground">
              총 {placeholderAchievements.length}개 중
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">달성률</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((unlockedAchievements.length / placeholderAchievements.length) * 100)}%
            </div>
            <Progress 
              value={(unlockedAchievements.length / placeholderAchievements.length) * 100} 
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최근 업적</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {unlockedAchievements.length > 0 ? '있음' : '없음'}
            </div>
            <p className="text-xs text-muted-foreground">
              {unlockedAchievements.length > 0 
                ? new Date(unlockedAchievements[0].unlockedAt).toLocaleDateString('ko-KR')
                : '아직 달성한 업적이 없습니다'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 달성한 업적 */}
      {unlockedAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">달성한 업적</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unlockedAchievements.map((achievement) => {
              const IconComponent = getIconComponent(achievement.icon || 'Award');
              return (
                <Card key={achievement.id} className="border-green-200 bg-green-50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <CardDescription>{achievement.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <Badge variant="default" className="bg-green-600">
                        달성 완료
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(achievement.unlockedAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* 잠금된 업적 */}
      <div>
        <h2 className="text-2xl font-bold mb-4">도전할 업적</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lockedAchievements.map((achievement) => {
            const IconComponent = getIconComponent(achievement.icon || 'Award');
            return (
              <Card key={achievement.id} className="opacity-60">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-full">
                      <IconComponent className="h-6 w-6 text-gray-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{achievement.title}</CardTitle>
                      <CardDescription>{achievement.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Badge variant="secondary">잠금됨</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 업적 가이드 */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>업적 달성 가이드</CardTitle>
          <CardDescription>업적을 달성하는 방법을 알아보세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">기본 업적</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 첫 번째 세션: 첫 번째 읽기 세션을 완료하세요</li>
                <li>• 꾸준함: 7일 연속으로 훈련하세요</li>
                <li>• 단어 마스터: 10,000단어를 읽으세요</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">고급 업적</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 속도 향상: 읽기 속도를 50% 향상시키세요</li>
                <li>• 이해도 마스터: 90% 이상의 이해도를 달성하세요</li>
                <li>• 레벨 업: 중급 레벨에 도달하세요</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 