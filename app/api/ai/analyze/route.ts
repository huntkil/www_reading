import { NextRequest, NextResponse } from 'next/server';
import { analyzeSession } from '@/lib/ai/analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionData, userProfile } = body;

    console.log('AI 분석 요청:', { sessionData, userProfile });

    // 입력 검증
    if (!sessionData || !userProfile) {
      return NextResponse.json(
        { error: 'sessionData와 userProfile이 필요합니다.' },
        { status: 400 }
      );
    }

    // AI 분석 실행
    const analysis = await analyzeSession({
      sessionData,
      userProfile
    });

    console.log('AI 분석 완료:', analysis);

    return NextResponse.json({
      success: true,
      analysis
    });
  } catch (error) {
    console.error('AI 분석 API 오류:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 