import { NextRequest, NextResponse } from 'next/server';
import { noteService } from '@/lib/notes/noteService';

// 노트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    let notes;
    if (sessionId) {
      notes = await noteService.getSessionNotes(sessionId);
    } else {
      notes = await noteService.getUserNotes(userId, limit, offset);
    }

    return NextResponse.json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('Failed to get notes:', error);
    return NextResponse.json(
      { error: 'Failed to get notes' },
      { status: 500 }
    );
  }
}

// 노트 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, sessionId, content, title, tags } = body;

    if (!userId || !content) {
      return NextResponse.json(
        { error: 'userId and content are required' },
        { status: 400 }
      );
    }

    const note = await noteService.createNote({
      userId,
      sessionId,
      content,
      title,
      tags
    });

    return NextResponse.json({
      success: true,
      data: note
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
} 