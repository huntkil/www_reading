import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/achievement - 모든 성취 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Use Prisma-generated type instead of `any` for stronger type safety
    const where: Prisma.AchievementWhereInput = {};
    if (userId) where.userId = userId;
    if (type) where.type = type;

    const achievements = await prisma.achievement.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        unlockedAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.achievement.count({ where });

    return NextResponse.json({
      success: true,
      data: achievements,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('성취 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '성취 목록을 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/achievement - 새 성취 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, description, icon } = body;

    if (!userId || !type || !title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAchievement = await prisma.achievement.create({
      data: {
        userId,
        type,
        title,
        description,
        icon,
      },
    });

    return NextResponse.json(newAchievement, { status: 201 });
  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json({ error: 'Error creating achievement' }, { status: 500 });
  }
} 