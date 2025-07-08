import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/session - 세션 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = userId ? { userId } : {};

    const sessions = await prisma.session.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        notes: {
          select: {
            id: true,
            content: true,
            createdAt: true,
          },
        },
        aiAnalyses: {
          select: {
            id: true,
            analysisType: true,
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

    const total = await prisma.session.count({ where });

    return NextResponse.json({
      success: true,
      data: sessions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('세션 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '세션 목록을 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/session - 새 세션 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, description, duration, wordCount, readingSpeed, comprehension } = body;

    // 필수 필드 검증
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '사용자 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 데이터 타입 및 범위 검증
    if (duration !== undefined && (typeof duration !== 'number' || duration < 0)) {
      return NextResponse.json(
        { success: false, error: 'duration은 0 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (wordCount !== undefined && (typeof wordCount !== 'number' || wordCount < 0)) {
      return NextResponse.json(
        { success: false, error: 'wordCount는 0 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (readingSpeed !== undefined && (typeof readingSpeed !== 'number' || readingSpeed < 0)) {
      return NextResponse.json(
        { success: false, error: 'readingSpeed는 0 이상의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    if (comprehension !== undefined && (typeof comprehension !== 'number' || comprehension < 0 || comprehension > 100)) {
      return NextResponse.json(
        { success: false, error: 'comprehension은 0-100 사이의 숫자여야 합니다.' },
        { status: 400 }
      );
    }

    // 문자열 길이 검증
    if (title && (typeof title !== 'string' || title.length > 200)) {
      return NextResponse.json(
        { success: false, error: 'title은 200자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    if (description && (typeof description !== 'string' || description.length > 1000)) {
      return NextResponse.json(
        { success: false, error: 'description은 1000자 이하여야 합니다.' },
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

    const session = await prisma.session.create({
      data: {
        userId,
        title: title || '새로운 읽기 세션',
        description: description || '',
        duration: duration || 0,
        wordCount: wordCount || 0,
        readingSpeed: readingSpeed || 0,
        comprehension: comprehension || 0,
        status: 'completed',
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
      data: session,
    }, { status: 201 });
  } catch (error) {
    console.error('세션 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '세션을 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
} 