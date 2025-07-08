import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/achievement - 성취 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {};
    const type = searchParams.get('type');
    if (type) where.type = type;

    const achievements = await prisma.achievement.findMany({
      where,
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
    const { type, title, description, icon } = body;

    // 필수 필드 검증
    if (!type || !title || !description) {
      return NextResponse.json(
        { success: false, error: 'type, title, description는 필수입니다.' },
        { status: 400 }
      );
    }

    const achievement = await prisma.achievement.create({
      data: {
        type,
        title,
        description,
        icon: icon || null,
        unlockedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: achievement,
    }, { status: 201 });
  } catch (error) {
    console.error('성취 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '성취를 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
} 