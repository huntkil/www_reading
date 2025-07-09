import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedPlan } from '@/lib/ai/analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionHistory } = body;

    console.log('AI 훈련 계획 생성 요청:', { sessionHistory });

    // sessionHistory가 없어도 빈 배열로 처리
    const sessionData = sessionHistory || [];

    // AI 훈련 계획 생성
    const plan = await generatePersonalizedPlan();

    console.log('AI 훈련 계획 생성 완료:', plan);

    return NextResponse.json({
      success: true,
      plan
    });
  } catch (error) {
    console.error('AI 훈련 계획 생성 API 오류:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 