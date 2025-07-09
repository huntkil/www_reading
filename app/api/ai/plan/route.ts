import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    // 사용자의 읽기 세션 데이터 분석
    const sessions = await prisma.session.findMany({
      where: { id: userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // 평균 읽기 속도 계산
    const averageSpeed = sessions.length > 0 
      ? sessions.reduce((sum, session) => sum + session.readingSpeed, 0) / sessions.length
      : 200 // 기본값

    // 개인화된 훈련 계획 생성
    const plan = {
      title: "개인화된 읽기 훈련 계획",
      content: `현재 평균 읽기 속도: ${averageSpeed.toFixed(1)} WPM\n목표: ${(averageSpeed * 1.3).toFixed(1)} WPM`,
      targetWpm: Math.round(averageSpeed * 1.3),
      duration: 30,
      exercises: [
        {
          type: "speed_training",
          duration: 10,
          description: "읽기 속도 향상 훈련"
        },
        {
          type: "comprehension_training", 
          duration: 10,
          description: "이해도 향상 훈련"
        },
        {
          type: "mixed_training",
          duration: 10,
          description: "종합 훈련"
        }
      ]
    }

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Plan generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate training plan' },
      { status: 500 }
    )
  }
} 