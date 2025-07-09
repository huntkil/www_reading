import { NextRequest, NextResponse } from 'next/server';
import { recommendContent } from '@/lib/ai/analysis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userProfile, preferences } = body;

  

    // 입력 검증
    if (!userProfile || !preferences) {
      return NextResponse.json(
        { error: 'userProfile과 preferences가 필요합니다.' },
        { status: 400 }
      );
    }

    // AI 콘텐츠 추천
    const recommendations = await recommendContent(userProfile, preferences);

  

    return NextResponse.json({
      success: true,
      recommendations
    });
  } catch (error) {
    console.error('AI 콘텐츠 추천 API 오류:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 