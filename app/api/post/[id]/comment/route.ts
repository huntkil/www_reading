import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const verification = await verifyAuth(request);
    if (!verification.user) {
      return NextResponse.json({ success: false, error: verification.error }, { status: verification.status });
    }
    
    const userId = verification.user.id;
    const postId = params.id;
    const { text } = await request.json();

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '댓글 내용이 필요합니다.' },
        { status: 400 }
      );
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        authorId: userId,
        postId,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: newComment }, { status: 201 });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { success: false, error: '댓글 작성에 실패했습니다.' },
      { status: 500 }
    );
  }
} 