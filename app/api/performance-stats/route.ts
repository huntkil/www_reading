import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const stats = await prisma.performanceStats.findUnique({
      where: { userId },
    });

    if (!stats) {
      // If no stats exist for the user, return default/zeroed stats
      const defaultStats = {
        userId,
        totalSessions: 0,
        totalDuration: 0,
        totalWordsRead: 0,
        averageComprehension: 0,
        bestComprehension: 0,
        averageSpeed: 0,
        lastSessionDate: null,
      };
      return NextResponse.json(defaultStats);
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching performance stats:', error);
    return NextResponse.json({ error: 'Error fetching performance stats' }, { status: 500 });
  }
}

// POST /api/performance-stats - 새 성과 통계 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      totalSessions, 
      totalDuration, 
      totalWordsRead, 
      averageComprehension, 
      bestComprehension, 
      averageSpeed, 
      lastSessionDate 
    } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 사용자 존재 확인
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 사용자입니다.' },
        { status: 404 }
      );
    }

    // 이미 성과 통계가 있는지 확인
    const existingStats = await prisma.performanceStats.findUnique({
      where: { userId },
    });

    if (existingStats) {
      return NextResponse.json(
        { success: false, error: '이미 성과 통계가 존재합니다. PUT 요청을 사용하세요.' },
        { status: 409 }
      );
    }

    const stats = await prisma.performanceStats.create({
      data: {
        userId,
        totalSessions: totalSessions || 0,
        totalDuration: totalDuration || 0,
        totalWordsRead: totalWordsRead || 0,
        averageComprehension: averageComprehension || 0,
        bestComprehension: bestComprehension || 0,
        averageSpeed: averageSpeed || 0,
        lastSessionDate: lastSessionDate ? new Date(lastSessionDate) : null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: stats,
    }, { status: 201 });
  } catch (error) {
    console.error('성과 통계 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '성과 통계를 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
} 