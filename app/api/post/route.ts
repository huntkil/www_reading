import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  try {
    const verification = await verifyAuth(request);
    const userId = verification.user?.id;

    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        likes: true,
      },
    });

    const postsWithLikeStatus = posts.map(post => {
      const likedByMe = userId ? post.likes.some(like => like.userId === userId) : false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { likes, ...rest } = post;
      return {
        ...rest,
        likedByMe,
        _count: {
          likes: post.likes.length,
          comments: post.comments.length,
        },
      };
    });

    return NextResponse.json({ posts: postsWithLikeStatus });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

// POST a new post
export async function POST(request: NextRequest) {
  try {
    const verification = await verifyAuth(request);
    if (!verification.user) {
      return NextResponse.json({ success: false, error: verification.error }, { status: verification.status });
    }
    const userId = verification.user.id;
    
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required.' },
        { status: 400 }
      );
    }

    const newPost = await prisma.post.create({
      data: {
        content,
        authorId: userId,
      },
       include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create post.' },
      { status: 500 }
    );
  }
} 