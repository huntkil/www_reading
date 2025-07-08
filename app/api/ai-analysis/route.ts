import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/ai-analysis - AI 분석 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const analysisType = searchParams.get('analysisType');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: Prisma.AIAnalysisWhereInput = {};
    if (sessionId) where.sessionId = sessionId;
    if (analysisType) where.analysisType = analysisType;

    const analyses = await prisma.aIAnalysis.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.aIAnalysis.count({ where });

    return NextResponse.json({
      success: true,
      data: analyses,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('AI 분석 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: 'AI 분석 목록을 조회할 수 없습니다.' },
      { status: 500 }
    );
  }
}

// POST /api/ai-analysis - 새 AI 분석 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, analysisType, analysis } = body;

    if (!sessionId || !analysisType || !analysis) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newAnalysis = await prisma.aIAnalysis.create({
      data: {
        sessionId,
        analysisType,
        analysis,
      },
    });

    return NextResponse.json(newAnalysis, { status: 201 });
  } catch (error) {
    console.error('Error creating AI analysis:', error);
    return NextResponse.json({ error: 'Error creating AI analysis' }, { status: 500 });
  }
} 