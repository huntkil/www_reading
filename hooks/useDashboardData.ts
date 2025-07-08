import { useState, useEffect } from 'react';
import { DashboardStats, Session } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

export function useDashboardData() {
  const { user } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    };

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // FIXME: API 라우팅이 /api/performance-stats/1 과 같이 userId를 필요로 하고 있습니다.
        // 현재는 임시로 '1'을 사용하고 있으나, 추후 인증된 user.id를 사용하도록 수정해야 합니다.
        const [statsRes, sessionsRes] = await Promise.all([
          fetch(`/api/performance-stats/${user.id}`), 
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
  }, [user]);

  return { dashboardStats, sessions, loading, error };
} 