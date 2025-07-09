'use client'

import { Dashboard } from '@/components/Dashboard/Dashboard'
import { useDashboardData } from '@/hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { dashboardStats, sessions, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-destructive mb-4">오류가 발생했습니다</p>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>
      {dashboardStats && (
        <Dashboard stats={dashboardStats} sessions={sessions} />
      )}
    </div>
  );
} 