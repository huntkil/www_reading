const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createPerformanceStats() {
  try {
    // 모든 사용자 조회
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        performanceStats: true
      }
    });

    console.log(`전체 사용자: ${allUsers.length}명`);

    // 성능 통계가 없는 사용자 필터링
    const usersWithoutStats = allUsers.filter(user => !user.performanceStats);

    console.log(`성능 통계가 없는 사용자: ${usersWithoutStats.length}명`);

    if (usersWithoutStats.length === 0) {
      console.log('모든 사용자가 성능 통계를 가지고 있습니다.');
      return;
    }

    // 각 사용자에 대해 성능 통계 생성
    for (const user of usersWithoutStats) {
      console.log(`사용자 ${user.email}에 대한 성능 통계 생성 중...`);
      
      await prisma.performanceStats.create({
        data: {
          userId: user.id,
          totalSessions: 0,
          totalReadingTime: 0,
          averageSpeed: 0,
          comprehensionScore: 0,
          lastSessionDate: null,
          weeklyProgress: '[]',
          monthlyProgress: '[]',
          goals: '[]',
          achievements: '[]'
        }
      });

      console.log(`✅ ${user.email}의 성능 통계 생성 완료`);
    }

    console.log('모든 사용자의 성능 통계 생성이 완료되었습니다.');
  } catch (error) {
    console.error('성능 통계 생성 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createPerformanceStats(); 