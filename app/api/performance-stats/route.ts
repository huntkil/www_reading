import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/performance-stats - 성과 통계 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const stats = await prisma.performanceStats.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.performanceStats.count();

    return NextResponse.json({
      success: true,
      data: stats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('성과 통계 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '성과 통계를 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/performance-stats - 성과 통계 생성/업데이트
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      totalSessions,
      totalDuration,
      totalWordsRead,
      averageComprehension,
      bestComprehension,
      averageSpeed,
      lastSessionDate,
    } = body;

    // 데이터 검증
    if (totalSessions !== undefined && (typeof totalSessions !== 'number' || totalSessions < 0)) {
      return NextResponse.json(
        { success: false, error: 'totalSessions는 0 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (totalDuration !== undefined && (typeof totalDuration !== 'number' || totalDuration < 0)) {
      return NextResponse.json(
        { success: false, error: 'totalDuration는 0 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (totalWordsRead !== undefined && (typeof totalWordsRead !== 'number' || totalWordsRead < 0)) {
      return NextResponse.json(
        { success: false, error: 'totalWordsRead는 0 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (averageComprehension !== undefined && (typeof averageComprehension !== 'number' || averageComprehension < 0 || averageComprehension > 100)) {
      return NextResponse.json(
        { success: false, error: 'averageComprehension는 0-100 사이의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (bestComprehension !== undefined && (typeof bestComprehension !== 'number' || bestComprehension < 0 || bestComprehension > 100)) {
      return NextResponse.json(
        { success: false, error: 'bestComprehension는 0-100 사이의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (averageSpeed !== undefined && (typeof averageSpeed !== 'number' || averageSpeed < 0)) {
      return NextResponse.json(
        { success: false, error: 'averageSpeed는 0 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    // 기존 통계 확인
    const existingStats = await prisma.performanceStats.findFirst();

    let stats;
    if (existingStats) {
      // 기존 통계 업데이트
      stats = await prisma.performanceStats.update({
        where: { id: existingStats.id },
        data: {
          totalSessions: totalSessions ?? existingStats.totalSessions,
          totalDuration: totalDuration ?? existingStats.totalDuration,
          totalWordsRead: totalWordsRead ?? existingStats.totalWordsRead,
          averageComprehension: averageComprehension ?? existingStats.averageComprehension,
          bestComprehension: bestComprehension ?? existingStats.bestComprehension,
          averageSpeed: averageSpeed ?? existingStats.averageSpeed,
          lastSessionDate: lastSessionDate ? new Date(lastSessionDate) : existingStats.lastSessionDate,
          updatedAt: new Date(),
        },
      });
    } else {
      // 새 통계 생성
      stats = await prisma.performanceStats.create({
        data: {
          totalSessions: totalSessions || 0,
          totalDuration: totalDuration || 0,
          totalWordsRead: totalWordsRead || 0,
          averageComprehension: averageComprehension || 0,
          bestComprehension: bestComprehension || 0,
          averageSpeed: averageSpeed || 0,
          lastSessionDate: lastSessionDate ? new Date(lastSessionDate) : null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: stats,
    }, { status: existingStats ? 200 : 201 });
  } catch (error) {
    console.error('성과 통계 생성/업데이트 오류:', error);
    return NextResponse.json(
      { success: false, error: '성과 통계를 생성/업데이트할 수 없습니다.' },
      { status: 500 }
    );
  }
} 