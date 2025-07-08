import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

// GET single plan (optional)
export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = params;
  const plan = await prisma.trainingPlan.findUnique({ where: { id } });
  if (!plan) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }
  return NextResponse.json(plan);
}

// Soft-delete (set isActive=false) or hard delete
export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = params;
  try {
    const updated = await prisma.trainingPlan.update({
      where: { id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, plan: updated });
  } catch (error) {
    console.error('Delete plan error:', error);
    return NextResponse.json({ error: 'Unable to delete plan' }, { status: 500 });
  }
}

// Update a training plan (e.g., rename)
export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = params;
  try {
    const body = await request.json();
    const {
      name,
      description,
      exercises,
      startDate,
      endDate,
      isActive,
    } = body;

    const updated = await prisma.trainingPlan.update({
      where: { id },
      data: {
        name,
        description,
        exercises: exercises ? JSON.stringify(exercises) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive,
      },
    });

    return NextResponse.json({ success: true, plan: updated });
  } catch (error) {
    console.error('Update plan error:', error);
    return NextResponse.json({ error: 'Unable to update plan' }, { status: 500 });
  }
} 