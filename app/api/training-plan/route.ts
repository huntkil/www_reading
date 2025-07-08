import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/training-plan - 훈련 계획 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const plans = await prisma.trainingPlan.findMany({
      where: { isActive: true },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.trainingPlan.count({
      where: { isActive: true },
    });

    return NextResponse.json({
      success: true,
      data: plans,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('훈련 계획 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '훈련 계획 목록을 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/training-plan - 새 훈련 계획 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, exercises, startDate, endDate } = body;

    // 필수 필드 검증
    if (!name || !exercises || !startDate) {
      return NextResponse.json(
        { success: false, error: 'name, exercises, startDate는 필수입니다.' },
        { status: 400 }
      );
    }

    const plan = await prisma.trainingPlan.create({
      data: {
        name,
        description: description || '',
        exercises: JSON.stringify(exercises),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: plan,
    }, { status: 201 });
  } catch (error) {
    console.error('훈련 계획 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '훈련 계획을 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
} 