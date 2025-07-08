import { prisma } from '@/lib/prisma';

export interface NoteData {
  id?: string;
  userId: string;
  sessionId?: string;
  content: string;
  title?: string;
  tags?: string[];
}

export class NoteService {
  // 노트 생성
  async createNote(data: NoteData) {
    return await prisma.note.create({
      data: {
        userId: data.userId,
        sessionId: data.sessionId,
        content: data.content,
        path: data.title || `note_${Date.now()}`,
        metadata: JSON.stringify({
          title: data.title,
          tags: data.tags || []
        })
      }
    });
  }

  // 노트 업데이트
  async updateNote(id: string, content: string) {
    return await prisma.note.update({
      where: { id },
      data: { 
        content,
        updatedAt: new Date()
      }
    });
  }

  // 노트 조회
  async getNote(id: string) {
    return await prisma.note.findUnique({
      where: { id }
    });
  }

  // 사용자 노트 목록
  async getUserNotes(userId: string, limit = 50, offset = 0) {
    return await prisma.note.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset
    });
  }

  // 세션 노트 조회
  async getSessionNotes(sessionId: string) {
    return await prisma.note.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' }
    });
  }

  // 노트 검색
  async searchNotes(userId: string, query: string, limit = 10) {
    return await prisma.note.findMany({
      where: {
        userId,
        content: {
          contains: query
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit
    });
  }

  // 노트 삭제
  async deleteNote(id: string) {
    return await prisma.note.delete({
      where: { id }
    });
  }
}

export const noteService = new NoteService(); 