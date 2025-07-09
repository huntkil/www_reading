import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/note - 노트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const notes = await prisma.note.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.note.count();

    return NextResponse.json({
      success: true,
      data: notes,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('노트 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '노트 목록을 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/note - 새 노트 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, content, metadata, sessionId } = body;

    // 필수 필드 검증
    if (!path || !content) {
      return NextResponse.json(
        { success: false, error: 'path와 content는 필수입니다.' },
        { status: 400 }
      );
    }

    const noteData = {
      path,
      content,
      metadata: metadata ? JSON.stringify(metadata) : null,
      ...(sessionId && { sessionId })
    };

    const note = await prisma.note.create({
      data: noteData,
    });

    return NextResponse.json({
      success: true,
      data: note,
    }, { status: 201 });
  } catch (error) {
    console.error('노트 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '노트를 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
} 