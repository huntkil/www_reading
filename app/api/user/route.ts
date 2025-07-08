import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 전체 사용자 조회
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        goals: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

// 회원가입
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, level = 'beginner', goals = '[]', preferences = '[]' } = body;
    if (!email || !name) {
      return NextResponse.json({ success: false, error: 'email과 name은 필수입니다.' }, { status: 400 });
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore – password is handled separately for auth routes
    const user = await prisma.user.create({
      data: {
        email,
        name,
        level,
        goals: typeof goals === 'string' ? goals : JSON.stringify(goals),
        preferences: typeof preferences === 'string' ? preferences : JSON.stringify(preferences)
      }
    });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 