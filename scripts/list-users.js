const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        createdAt: true
      }
    });

    console.log('데이터베이스의 모든 사용자:');
    console.log('========================');
    
    if (users.length === 0) {
      console.log('사용자가 없습니다.');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ID: ${user.id}`);
        console.log(`   이메일: ${user.email}`);
        console.log(`   이름: ${user.name}`);
        console.log(`   레벨: ${user.level}`);
        console.log(`   생성일: ${user.createdAt}`);
        console.log('---');
      });
    }

    console.log(`총 ${users.length}명의 사용자가 있습니다.`);
  } catch (error) {
    console.error('사용자 목록 조회 중 오류:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers(); 