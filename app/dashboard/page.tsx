'use client'

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, BookOpen, Target, TrendingUp, Clock, Award } from 'lucide-react';

interface PerformanceStats {
  id: string;
  userId: string;
  totalSessions: number;
  totalDuration: number;
  totalWordsRead: number;
  averageComprehension: number;
  bestComprehension: number;
  averageSpeed: number;
  lastSessionDate: string | null;
  updatedAt: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/performance-stats/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchStats();
    }
  }, [isAuthenticated, user, fetchStats]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="text-muted-foreground">대시보드를 보려면 로그인해주세요.</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">대시보드</h1>
        <p className="text-muted-foreground">
          안녕하세요, {user?.name}님! 오늘도 읽기 훈련을 시작해보세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 세션</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSessions || 0}</div>
            <p className="text-xs text-muted-foreground">
              지금까지 완료한 세션 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 읽은 단어</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalWordsRead ? stats.totalWordsRead.toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              누적 읽은 단어 수
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 이해도</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageComprehension ? Math.round(stats.averageComprehension) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              전체 세션 평균
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 속도</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageSpeed ? Math.round(stats.averageSpeed) : 0}
            </div>
            <p className="text-xs text-muted-foreground">
              단어/분
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>진행 상황</CardTitle>
            <CardDescription>현재 레벨과 목표 달성도</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">현재 레벨</span>
                  <Badge variant="secondary">{user?.level || 'beginner'}</Badge>
                </div>
                <Progress value={stats?.totalSessions ? Math.min((stats.totalSessions / 10) * 100, 100) : 0} />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">최고 이해도</span>
                  <span className="text-sm text-muted-foreground">
                    {stats?.bestComprehension || 0}%
                  </span>
                </div>
                <Progress value={stats?.bestComprehension || 0} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
            <CardDescription>마지막 세션 정보</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">마지막 세션</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.lastSessionDate 
                      ? new Date(stats.lastSessionDate).toLocaleDateString('ko-KR')
                      : '아직 세션이 없습니다'
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">총 훈련 시간</p>
                  <p className="text-xs text-muted-foreground">
                    {stats?.totalDuration ? Math.round(stats.totalDuration / 60) : 0}시간
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex gap-4">
        <Button className="flex-1">
          <BookOpen className="mr-2 h-4 w-4" />
          새 세션 시작
        </Button>
        <Button variant="outline" className="flex-1">
          <Target className="mr-2 h-4 w-4" />
          목표 설정
        </Button>
      </div>
    </div>
  );
} 