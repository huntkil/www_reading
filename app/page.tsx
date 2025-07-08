'use client'

import { useState } from 'react'
import { Dashboard } from '@/components/Dashboard/Dashboard'
import { TrainingModal } from '@/components/Training/TrainingModal'
import { TrainingSession } from '@/components/Training/TrainingSession'
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Zap, Target, TrendingUp, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CommunityFeed } from '@/components/Community/CommunityFeed';
import { TrainingPlan } from '@/lib/types';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { user, isAuthenticated, isLoading: isAuthLoading, openAuthModal } = useAuth();
  const { dashboardStats, sessions, loading: isDashboardLoading, error: dashboardError } = useDashboardData();
  const { toast } = useToast();

  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null)
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false)
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const handleGeneratePlan = async () => {
    if (!user) return;
    setIsGeneratingPlan(true);
    try {
      const response = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: user, sessionHistory: sessions }),
      });
      const data = await response.json();
      if (data.success) {
        setTrainingPlan(data.plan);
        setIsTrainingModalOpen(true);
        toast({
          title: "훈련 계획 생성 완료",
          description: "AI가 개인 맞춤형 훈련 계획을 생성했습니다.",
        });
      } else {
        toast({
          title: "훈련 계획 생성 실패",
          description: data.error || "훈련 계획을 생성하는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Generate plan error:', error);
      toast({
        title: "네트워크 오류",
        description: "서버와의 연결에 문제가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };
  
  const handleTrainingStartClick = () => {
    if (isAuthenticated) {
      handleGeneratePlan();
    } else {
      openAuthModal();
    }
  }

  const handleStartTrainingSession = () => {
    setIsTrainingModalOpen(false);
  }

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            AI 기반 속독 훈련
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            인공지능이 분석한 개인 맞춤형 훈련으로 당신의 독서 능력을 한 단계 끌어올리세요.
            빠른 속도와 높은 이해도를 동시에 달성하세요.
          </p>
          <Button onClick={handleTrainingStartClick} size="lg" className="text-lg px-8 py-6" disabled={isGeneratingPlan}>
            {isGeneratingPlan ? (
              <>
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                AI 훈련 계획 생성 중...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-6 w-6" />
                훈련 시작하기
                <ArrowRight className="ml-2 h-6 w-6" />
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>개인 맞춤형 훈련</CardTitle>
                <CardDescription>
                  AI가 분석한 개인 데이터를 바탕으로 최적화된 훈련 계획을 제공합니다.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>실시간 성과 분석</CardTitle>
                <CardDescription>
                  훈련 과정에서 실시간으로 읽기 속도와 이해도를 측정하고 분석합니다.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>커뮤니티 지원</CardTitle>
                <CardDescription>
                  다른 학습자들과 함께 목표를 달성하고 서로를 격려하는 커뮤니티를 제공합니다.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      {trainingPlan ? (
        <section className="py-8">
          <TrainingSession plan={trainingPlan} onSessionComplete={() => setTrainingPlan(null)} />
        </section>
      ) : (
        <>
          {/* Dashboard Section */}
          {isAuthenticated && (
            <section className="py-8 px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">내 학습 현황</h2>
                {isDashboardLoading && (
                  <div className="flex justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">데이터를 불러오는 중...</p>
                    </div>
                  </div>
                )}
                {dashboardError && (
                  <Card className="border-destructive">
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-2 text-destructive">
                        <CheckCircle className="h-5 w-5" />
                        <p>{dashboardError.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {dashboardStats && (
                  <Dashboard stats={dashboardStats} sessions={sessions} />
                )}
              </div>
            </section>
          )}

          {/* Community Section */}
          {isAuthenticated && (
            <section className="py-12 px-4 bg-muted/30">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">커뮤니티</h2>
                <CommunityFeed />
              </div>
            </section>
          )}
        </>
      )}
      
      <TrainingModal
        open={isTrainingModalOpen}
        onOpenChange={setIsTrainingModalOpen}
        plan={trainingPlan}
        onStartTraining={handleStartTrainingSession}
        onSessionComplete={() => {}}
      />
    </div>
  )
} 