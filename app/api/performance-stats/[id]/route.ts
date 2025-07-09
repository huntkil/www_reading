import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/performance-stats/[id] - 특정 성과 통계 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const statsId = params.id;

    // 1. id로 먼저 조회
    let stats = await prisma.performanceStats.findUnique({
      where: { id: statsId },
    });

    // 2. 없으면 userId로 조회 (이제 필요 없음, 단일 사용자)

    if (!stats) {
      return NextResponse.json(
        { success: false, error: '성과 통계를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('성과 통계 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '성과 통계를 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/performance-stats/[id] - 성과 통계 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const statsId = params.id;
    const body = await request.json();
    const { 
      totalSessions, 
      totalDuration, 
      totalWordsRead, 
      averageComprehension, 
      bestComprehension, 
      averageSpeed, 
      lastSessionDate 
    } = body;

    // 성과 통계 존재 확인
    const existingStats = await prisma.performanceStats.findUnique({
      where: { id: statsId },
    });

    if (!existingStats) {
      return NextResponse.json(
        { success: false, error: '성과 통계를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedStats = await prisma.performanceStats.update({
      where: { id: statsId },
      data: {
        totalSessions,
        totalDuration,
        totalWordsRead,
        averageComprehension,
        bestComprehension,
        averageSpeed,
        lastSessionDate: lastSessionDate ? new Date(lastSessionDate) : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedStats,
    });
  } catch (error) {
    console.error('성과 통계 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '성과 통계를 수정할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/performance-stats/[id] - 성과 통계 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const statsId = params.id;

    // 성과 통계 존재 확인
    const existingStats = await prisma.performanceStats.findUnique({
      where: { id: statsId },
    });

    if (!existingStats) {
      return NextResponse.json(
        { success: false, error: '성과 통계를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.performanceStats.delete({
      where: { id: statsId },
    });

    return NextResponse.json({
      success: true,
      message: '성과 통계가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('성과 통계 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '성과 통계를 삭제할 수 없습니다.' },
      { status: 500 }
    );
  }
} 