'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChart } from './ProgressChart';
import { DashboardStats, Session } from '@/lib/types';

interface DashboardProps {
  stats: DashboardStats;
  sessions: Session[];
}

export function Dashboard({ stats, sessions }: DashboardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>요약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-300">총 세션</p>
              <p className="text-3xl font-bold">{stats.totalSessions}</p>
            </div>
            <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
              <p className="text-sm font-medium text-green-600 dark:text-green-300">평균 WPM</p>
              <p className="text-3xl font-bold">{stats.avgWpm}</p>
            </div>
            <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-300">총 훈련 시간</p>
              <p className="text-3xl font-bold">{stats.totalHours}<span className="text-lg">시간</span></p>
            </div>
          </div>
        </CardContent>
      </Card>
      <ProgressChart sessions={sessions} />
    </div>
  );
} 