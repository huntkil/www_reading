import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    cookies().delete('token');
    
    return NextResponse.json({
      success: true,
      message: '성공적으로 로그아웃되었습니다.',
    });

  } catch (error) {
    console.error('로그아웃 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 