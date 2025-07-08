import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/post/[id]/like - 좋아요 토글
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // 기존 좋아요 확인
    const existingLike = await prisma.like.findUnique({
      where: {
        postId: params.id,
      },
    });

    if (existingLike) {
      // 좋아요 제거
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json({
        success: true,
        data: { liked: false },
      });
    } else {
      // 좋아요 추가
      await prisma.like.create({
        data: {
          postId: params.id,
        },
      });

      return NextResponse.json({
        success: true,
        data: { liked: true },
      });
    }
  } catch (error) {
    console.error('좋아요 토글 오류:', error);
    return NextResponse.json(
      { success: false, error: '좋아요를 처리할 수 없습니다.' },
      { status: 500 }
    );
  }
} 