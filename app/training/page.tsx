'use client'

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Target, Clock, TrendingUp, Play, Brain, Trash2, Pencil, HelpCircle } from 'lucide-react';
import TrainingSessionModal from '@/components/Training/TrainingSessionModal';
import TrainingHelpModal from '@/components/Training/TrainingHelpModal';

interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  startDate: string;
  endDate: string | null;
  isActive: boolean;
}

interface Exercise {
  name: string;
  description: string;
  duration: string;
  difficulty: string;
}

export default function TrainingPage() {
  const { user, isAuthenticated } = useAuth();
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionType, setSessionType] = useState<'quick' | 'speed' | 'custom'>('quick');
  const [customExercises, setCustomExercises] = useState<Exercise[]>([]);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [helpExerciseName, setHelpExerciseName] = useState('');

  // Fetch plans function wrapped with useCallback to satisfy hook deps rule
  const fetchTrainingPlans = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/training-plan?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        // exercises 파싱
        type RawPlan = Omit<TrainingPlan, 'exercises'> & { exercises: string | Exercise[] };
        const parsed = (data || []).map((p: RawPlan) => ({
          ...p,
          exercises: typeof p.exercises === 'string' ? JSON.parse(p.exercises) : p.exercises,
        }));
        setPlans(parsed);
      }
    } catch (error) {
      console.error('Failed to fetch training plans:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchTrainingPlans();
    }
  }, [isAuthenticated, user, fetchTrainingPlans]);

  const handleStartSession = (type: 'quick' | 'speed' | 'custom') => {
    setSessionType(type);
    setModalOpen(true);
  };

  const handleStartCustomSession = (plan: TrainingPlan & { exercises: Exercise[] }) => {
    setCustomExercises(plan.exercises || []);
    handleStartSession('custom');
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('정말로 이 훈련 계획을 삭제하시겠습니까?')) return;
    try {
      await fetch(`/api/training-plan/${id}`, { method: 'DELETE' });
      fetchTrainingPlans();
    } catch (error) {
      console.error('Delete plan error:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 맞춤형 훈련 계획 생성
  const handleGeneratePlan = async () => {
    if (!user) return;

    try {
      // 1) AI에게 개인화된 계획 생성 요청
      const aiRes = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: user, sessionHistory: [] }),
      });

      const aiData = await aiRes.json();
      if (!aiRes.ok || !aiData?.success) {
        throw new Error(aiData?.error || 'AI plan generation failed');
      }

      const { plan } = aiData;

      // 2) 백엔드에 저장하여 내 훈련 계획 목록에 추가
      await fetch('/api/training-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: plan.title || '맞춤형 훈련 계획',
          description: plan.description || '',
          exercises: plan.exercises || [],
          startDate: new Date().toISOString(),
          endDate: null,
        }),
      });

      // 3) 계획 목록 갱신
      fetchTrainingPlans();
    } catch (error) {
      console.error('Plan generation error:', error);
      alert('훈련 계획 생성에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleRenamePlan = async (plan: TrainingPlan) => {
    const newName = prompt('새 계획 이름을 입력하세요', plan.name);
    if (!newName || newName === plan.name) return;
    try {
      await fetch(`/api/training-plan/${plan.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      fetchTrainingPlans();
    } catch (error) {
      console.error('Rename plan error:', error);
      alert('이름 변경에 실패했습니다.');
    }
  };

  const handleShowHelp = (exerciseName: string) => {
    setHelpExerciseName(exerciseName);
    setHelpModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">로그인이 필요합니다</h1>
          <p className="text-muted-foreground">훈련 페이지를 보려면 로그인해주세요.</p>
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
        <h1 className="text-3xl font-bold mb-2">훈련</h1>
        <p className="text-muted-foreground mb-4">
          인지과학 연구를 바탕으로 설계된 체계적인 훈련 프로그램으로 읽기 능력을 향상시켜보세요.
        </p>
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            연구 기반 접근
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            이 훈련 프로그램은 최신 인지과학 연구를 바탕으로 설계되었습니다. 
            읽기 과정에서 발생하는 자연스러운 인지 현상을 이해하고 최적화하는 것이 목표입니다. 
            이해력과 속도의 균형을 찾는 것이 핵심입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle>빠른 시작</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShowHelp('빠른 시작 훈련')}
                className="h-8 w-8 p-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>연구 기반 기본 읽기 능력 향상 훈련</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">난이도</span>
                <Badge variant="secondary">초급-중급</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">예상 시간</span>
                <span className="text-sm text-muted-foreground">25분</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">핵심 기술</span>
                <Badge variant="outline" className="text-xs">읽기 최적화</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• 읽기 패턴 진단 (현재 방식 파악)</p>
                <p>• 페이서 훈련 (손가락/펜으로 따라가기)</p>
                <p>• 의미 단위 읽기 (단어 그룹화 연습)</p>
              </div>
              <Button className="w-full" onClick={() => handleStartSession('quick')}>
                <Play className="mr-2 h-4 w-4" />
                시작하기
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <CardTitle>맞춤형 훈련</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShowHelp('맞춤형 훈련')}
                className="h-8 w-8 p-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>개인 진단 및 맞춤형 최적화 훈련</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">훈련 유형</span>
                <Badge variant="outline">맞춤형</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">예상 시간</span>
                <span className="text-sm text-muted-foreground">30분</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">핵심 기술</span>
                <Badge variant="outline" className="text-xs">개인 최적화</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• 개인 진단 및 맞춤 계획</p>
                <p>• 통합적 읽기 훈련</p>
                <p>• 지속적 모니터링</p>
              </div>
              <Button variant="outline" className="w-full" onClick={handleGeneratePlan}>
                계획 생성
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                <CardTitle>속도 향상</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShowHelp('속도 향상 훈련')}
                className="h-8 w-8 p-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>인지 병목 현상 극복 및 시각적 처리 강화</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">난이도</span>
                <Badge variant="secondary">중급-고급</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">예상 시간</span>
                <span className="text-sm text-muted-foreground">35분</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">핵심 기술</span>
                <Badge variant="outline" className="text-xs">시각적 처리</Badge>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• 인지 병목 현상 이해</p>
                <p>• 시각화 훈련</p>
                <p>• 적응적 속도 훈련</p>
              </div>
              <Button variant="outline" className="w-full" onClick={() => handleStartSession('speed')}>
                시작하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">내 훈련 계획</h2>
        {plans.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">아직 훈련 계획이 없습니다</h3>
                <p className="text-muted-foreground mb-4">
                  첫 번째 훈련 계획을 생성해보세요.
                </p>
                <Button onClick={handleGeneratePlan} variant="outline">
                  <Target className="mr-2 h-4 w-4" />
                  계획 생성하기
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    <Badge variant={plan.isActive ? "default" : "secondary"}>
                      {plan.isActive ? "활성" : "비활성"}
                    </Badge>
                    <div className="flex gap-1">
                      {plan.isActive && (
                        <Button size="icon" variant="ghost" onClick={() => handleRenamePlan(plan)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {plan.isActive && (
                        <Button size="icon" variant="ghost" onClick={() => handleDeletePlan(plan.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">시작일</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(plan.startDate).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    {plan.endDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">종료일</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(plan.endDate).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                    )}
                    <Button 
                      className="w-full" 
                      disabled={!plan.isActive}
                      onClick={() => handleStartCustomSession(plan)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      훈련 시작
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>훈련 통계</CardTitle>
            <CardDescription>이번 주 훈련 현황</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">완료한 세션</span>
                <span className="text-sm font-medium">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">총 훈련 시간</span>
                <span className="text-sm font-medium">0시간</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">평균 속도</span>
                <span className="text-sm font-medium">0 WPM</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>다음 목표</CardTitle>
            <CardDescription>달성할 다음 목표</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">첫 번째 세션 완료</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">30분 연속 훈련</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">속도 200 WPM 달성</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <TrainingSessionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        sessionType={sessionType}
        userLevel={user?.level}
        customExercises={customExercises}
      />
      <TrainingHelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
        exerciseName={helpExerciseName}
        sessionType={sessionType}
      />
    </div>
  );
} 