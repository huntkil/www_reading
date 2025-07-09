import { useState, useEffect } from 'react';
import { DashboardStats, Session } from '@/lib/types';

export function useDashboardData() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, sessionsRes] = await Promise.all([
          fetch('/api/performance-stats/1'), 
          fetch('/api/session'),
        ]);
        if (!statsRes.ok || !sessionsRes.ok) {
          throw new Error('대시보드 데이터를 가져오는데 실패했습니다.');
        }
        const stats = await statsRes.json();
        const sessionsData = await sessionsRes.json();

        setDashboardStats(stats);
        setSessions(sessionsData.sessions);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('알 수 없는 오류가 발생했습니다.'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dashboardStats, sessions, loading, error };
} 