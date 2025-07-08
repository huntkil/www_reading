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

    // Check if the user has already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      // User has liked it, so unlike it
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ success: true, message: 'Unliked' });
    } else {
      // User has not liked it, so like it
      await prisma.like.create({
        data: {
          userId,
          postId,
        },
      });
      return NextResponse.json({ success: true, message: 'Liked' });
    }
  } catch (error) {
    console.error('Error liking post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to like post.' },
      { status: 500 }
    );
  }
} 