import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const plans = await prisma.trainingPlan.findMany({
      where: { userId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Error fetching training plans:', error);
    return NextResponse.json({ error: 'Error fetching training plans' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, description, exercises, startDate, endDate } = body;

    if (!userId || !name || !exercises || !startDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 중복 확인: 같은 이름의 활성 플랜이 이미 있으면 새로 만들지 않음
    const existing = await prisma.trainingPlan.findFirst({
      where: {
        userId,
        name,
        isActive: true,
      },
    });

    if (existing) {
      // 이미 존재하는 플랜을 반환 (201 대신 200)
      return NextResponse.json(existing, { status: 200 });
    }

    const newPlan = await prisma.trainingPlan.create({
      data: {
        userId,
        name,
        description,
        exercises: JSON.stringify(exercises),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return NextResponse.json(newPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating training plan:', error);
    return NextResponse.json({ error: 'Error creating training plan' }, { status: 500 });
  }
} 