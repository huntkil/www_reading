import { NextRequest, NextResponse } from 'next/server';
import { noteService } from '@/lib/notes/noteService';

// 노트 목록 조회
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let notes;
    if (sessionId) {
      notes = await noteService.getSessionNotes(sessionId);
    } else {
      notes = await noteService.getAllNotes(limit, offset);
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
    const { sessionId, content, title, tags } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      );
    }

    const note = await noteService.createNote({
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