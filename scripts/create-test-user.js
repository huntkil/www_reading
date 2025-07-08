const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // 기존 테스트 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (existingUser) {
      console.log('테스트 사용자가 이미 존재합니다:', existingUser.email);
      return;
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash('password123', 10);

    // 테스트 사용자 생성
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: '테스트 사용자',
        goals: '[]',
        preferences: '[]',
      },
    });

    // 성능 통계 생성
    await prisma.performanceStats.create({
      data: {
        userId: testUser.id,
        totalSessions: 0,
        totalDuration: 0,
        totalWordsRead: 0,
        averageComprehension: 0,
        bestComprehension: 0,
        averageSpeed: 0,
      }
    });

    console.log('테스트 사용자가 생성되었습니다:');
    console.log('이메일:', testUser.email);
    console.log('비밀번호: password123');
    console.log('이름:', testUser.name);

  } catch (error) {
    console.error('테스트 사용자 생성 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser(); 