import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface AchievementData {
  id: string
  type: string
  title: string
  description: string
  icon: string | null
  unlockedAt: Date
}

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: {
        unlockedAt: 'desc'
      }
    })

    const formattedAchievements: AchievementData[] = achievements.map((achievement) => ({
      id: achievement.id,
      type: achievement.type,
      title: achievement.title,
      description: achievement.description,
      icon: achievement.icon,
      unlockedAt: achievement.unlockedAt
    }))

    return NextResponse.json(formattedAchievements)
  } catch (error) {
    console.error('Achievement fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    )
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