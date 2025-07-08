import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/post/[id]/comment - 댓글 생성
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'text는 필수이며 비어있을 수 없습니다.' },
        { status: 400 }
      );
    }

    if (text.length > 500) {
      return NextResponse.json(
        { success: false, error: 'text는 500자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    // 포스트 존재 확인
    const post = await prisma.post.findUnique({
      where: { id: params.id },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 포스트입니다.' },
        { status: 404 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        text: text.trim(),
        postId: params.id,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('댓글 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '댓글을 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
} 