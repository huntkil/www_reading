import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/session/[id] - 특정 세션 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        notes: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        aiAnalyses: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        trainingPlans: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: '세션을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error('세션 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '세션을 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/session/[id] - 세션 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;
    const body = await request.json();
    const { title, description, duration, wordCount, readingSpeed, comprehension, status } = body;

    // 세션 존재 확인
    const existingSession = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return NextResponse.json(
        { success: false, error: '세션을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        title,
        description,
        duration,
        wordCount,
        readingSpeed,
        comprehension,
        status,
        updatedAt: new Date(),
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
      data: updatedSession,
    });
  } catch (error) {
    console.error('세션 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '세션을 수정할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/session/[id] - 세션 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id;

    // 세션 존재 확인
    const existingSession = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!existingSession) {
      return NextResponse.json(
        { success: false, error: '세션을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 관련 데이터와 함께 삭제
    await prisma.session.delete({
      where: { id: sessionId },
    });

    return NextResponse.json({
      success: true,
      message: '세션이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('세션 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '세션을 삭제할 수 없습니다.' },
      { status: 500 }
    );
  }
} 