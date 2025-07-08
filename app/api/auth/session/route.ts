import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        goals: true,
        preferences: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      // Clear invalid cookie
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.delete('token');
      return response;
    }

    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch {
    // Error verifying token (expired, invalid, etc.)
    const response = NextResponse.json({ success: false, user: null }, { status: 200, statusText: 'Invalid token' });
    response.cookies.delete('token');
    return response;
  }
} 