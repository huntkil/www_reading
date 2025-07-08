import { useState, useEffect, useCallback, useRef } from 'react';
import { noteService } from '@/lib/notes/noteService';

interface UseRealTimeNotesProps {
  userId: string;
  sessionId?: string;
  debounceMs?: number;
}

interface UseRealTimeNotesReturn {
  content: string;
  setContent: (content: string) => void;
  isSaving: boolean;
  isSaved: boolean;
  error: string | null;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  saveImmediately: () => void;
}

export function useRealTimeNotes({
  userId,
  sessionId,
  debounceMs = 2000
}: UseRealTimeNotesProps): UseRealTimeNotesReturn {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContent = useRef('');

  const saveToDatabase = useCallback(async (newContent: string) => {
    if (newContent === lastSavedContent.current) {
      return;
    }

    setIsSaving(true);
    setSaveStatus('saving');
    setError(null);

    try {
      // 데이터베이스에 노트 저장
      await noteService.createNote({
        userId,
        sessionId,
        content: `**실시간 메모** (${new Date().toLocaleTimeString()}): ${newContent}`,
        title: '읽기 세션 메모'
      });

      lastSavedContent.current = newContent;
      setIsSaved(true);
      setSaveStatus('saved');
      
      // 3초 후 saved 상태 해제
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  }, [userId, sessionId]);

  const debouncedSave = useCallback((newContent: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveToDatabase(newContent);
    }, debounceMs);
  }, [saveToDatabase, debounceMs]);

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setIsSaved(false);
    setSaveStatus('idle');
    debouncedSave(newContent);
  }, [debouncedSave]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // 즉시 저장 함수 (수동 저장용)
  const saveImmediately = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    saveToDatabase(content);
  }, [content, saveToDatabase]);

  return {
    content,
    setContent: handleContentChange,
    isSaving,
    isSaved,
    error,
    saveStatus,
    saveImmediately
  };
} 