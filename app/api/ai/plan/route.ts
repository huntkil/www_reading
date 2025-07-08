import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedPlan } from '@/lib/ai/analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, sessionHistory } = body;

    console.log('AI 훈련 계획 생성 요청:', { userProfile, sessionHistory });

    // 입력 검증
    if (!userProfile) {
      return NextResponse.json(
        { error: 'userProfile이 필요합니다.' },
        { status: 400 }
      );
    }

    // AI 훈련 계획 생성
    const plan = await generatePersonalizedPlan(userProfile, sessionHistory || []);

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