import { PrismaClient, Session, PerformanceStats } from '@prisma/client';
import { sub } from 'date-fns';

const prisma = new PrismaClient();

interface ReportData {
  summary: PerformanceStats | null;
  weeklyTrends: { date: string, wpm: number, accuracy: number }[];
  recentSessions: Session[];
}

export async function getPerformanceReport(userId: string): Promise<ReportData> {
  const userStats = await prisma.performanceStats.findUnique({
    where: { userId },
  });

  const sevenDaysAgo = sub(new Date(), { days: 7 });

  const recentSessions = await prisma.session.findMany({
    where: {
      userId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  // This is a simplified trend calculation
  const weeklyTrends = recentSessions.map(session => ({
    date: session.createdAt.toISOString().split('T')[0],
    wpm: session.readingSpeed,
    accuracy: session.comprehension,
  }));

  return {
    summary: userStats,
    weeklyTrends,
    recentSessions,
  };
}

// Other analytics functions can be added here... 