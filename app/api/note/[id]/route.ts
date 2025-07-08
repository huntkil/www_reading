import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/note/[id] - 특정 노트 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;

    const note = await prisma.note.findUnique({
      where: { id: noteId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        session: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
    });

    if (!note) {
      return NextResponse.json(
        { success: false, error: '노트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: note,
    });
  } catch (error) {
    console.error('노트 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '노트를 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/note/[id] - 노트 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;
    const body = await request.json();
    const { path, content, metadata } = body;

    // 노트 존재 확인
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: '노트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: {
        path,
        content,
        metadata: metadata ? JSON.stringify(metadata) : null,
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
        session: {
          select: {
            id: true,
            title: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedNote,
    });
  } catch (error) {
    console.error('노트 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '노트를 수정할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/note/[id] - 노트 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const noteId = params.id;

    // 노트 존재 확인
    const existingNote = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existingNote) {
      return NextResponse.json(
        { success: false, error: '노트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json({
      success: true,
      message: '노트가 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('노트 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '노트를 삭제할 수 없습니다.' },
      { status: 500 }
    );
  }
} 