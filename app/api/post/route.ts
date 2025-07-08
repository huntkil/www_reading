import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/post - 포스트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const posts = await prisma.post.findMany({
      include: {
        comments: {
          orderBy: {
            createdAt: 'asc',
          },
        },
        likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    // 응답 데이터 가공
    const processedPosts = posts.map(post => ({
      id: post.id,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      comments: post.comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt.toISOString(),
      })),
      _count: {
        likes: post.likes.length,
        comments: post.comments.length,
      },
      likedByMe: false, // 개인 기록용이므로 항상 false
    }));

    const total = await prisma.post.count();

    return NextResponse.json({
      success: true,
      data: processedPosts,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('포스트 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '포스트 목록을 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/post - 새 포스트 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    // 필수 필드 검증
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'content는 필수이며 비어있을 수 없습니다.' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'content는 1000자 이하여야 합니다.' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        content: content.trim(),
      },
      include: {
        comments: true,
        likes: true,
      },
    });

    const processedPost = {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt.toISOString(),
      comments: post.comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        createdAt: comment.createdAt.toISOString(),
      })),
      _count: {
        likes: post.likes.length,
        comments: post.comments.length,
      },
      likedByMe: false,
    };

    return NextResponse.json({
      success: true,
      data: processedPost,
    }, { status: 201 });
  } catch (error) {
    console.error('포스트 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '포스트를 생성할 수 없습니다.' },
      { status: 500 }
    );
  }
} 