import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ai-analysis/[id] - 특정 AI 분석 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id;

    const analysis = await prisma.aIAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            userId: true,
            createdAt: true,
          },
        },
      },
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: 'AI 분석을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('AI 분석 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: 'AI 분석을 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// PUT /api/ai-analysis/[id] - AI 분석 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id;
    const body = await request.json();
    const { analysisType, analysis } = body;

    // AI 분석 존재 확인
    const existingAnalysis = await prisma.aIAnalysis.findUnique({
      where: { id: analysisId },
    });

    if (!existingAnalysis) {
      return NextResponse.json(
        { success: false, error: 'AI 분석을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const updatedAnalysis = await prisma.aIAnalysis.update({
      where: { id: analysisId },
      data: {
        analysisType,
        analysis: JSON.stringify(analysis),
      },
      include: {
        session: {
          select: {
            id: true,
            title: true,
            userId: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedAnalysis,
    });
  } catch (error) {
    console.error('AI 분석 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: 'AI 분석을 수정할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// DELETE /api/ai-analysis/[id] - AI 분석 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analysisId = params.id;

    // AI 분석 존재 확인
    const existingAnalysis = await prisma.aIAnalysis.findUnique({
      where: { id: analysisId },
    });

    if (!existingAnalysis) {
      return NextResponse.json(
        { success: false, error: 'AI 분석을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    await prisma.aIAnalysis.delete({
      where: { id: analysisId },
    });

    return NextResponse.json({
      success: true,
      message: 'AI 분석이 성공적으로 삭제되었습니다.',
    });
  } catch (error) {
    console.error('AI 분석 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: 'AI 분석을 삭제할 수 없습니다.' },
      { status: 500 }
    );
  }
} 