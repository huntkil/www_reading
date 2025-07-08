import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/achievement/[id] - 특정 성취 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const achievementId = params.id;

    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
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

    if (!achievement) {
      return NextResponse.json(
        { success: false, error: '성취를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: achievement,
    });
  } catch (error) {
    console.error('성취 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '성취를 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/achievement/[id] - 성취 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const achievementId = params.id;
    const body = await request.json();
    const { type, title, description, icon } = body;

    // 성취 존재 확인
    const existingAchievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!existingAchievement) {
      return NextResponse.json(
        { success: false, error: '성취를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedAchievement = await prisma.achievement.update({
      where: { id: achievementId },
      data: {
        type,
        title,
        description,
        icon,
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
      data: updatedAchievement,
    });
  } catch (error) {
    console.error('성취 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '성취를 수정할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/achievement/[id] - 성취 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const achievementId = params.id;

    // 성취 존재 확인
    const existingAchievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!existingAchievement) {
      return NextResponse.json(
        { success: false, error: '성취를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.achievement.delete({
      where: { id: achievementId },
    });

    return NextResponse.json({
      success: true,
      message: '성취가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('성취 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '성취를 삭제할 수 없습니다.' },
      { status: 500 }
    );
  }
} 