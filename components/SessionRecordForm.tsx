/* eslint-disable */
import { useState } from 'react';

interface SessionRecordFormProps {
  userId?: string;
  onSessionComplete?: () => void;
}

export function SessionRecordForm({ userId, onSessionComplete }: SessionRecordFormProps) {
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ userId, wpm, accuracy });
    // API call to save the session would go here

    if (onSessionComplete) {
      onSessionComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">세션 제목</label>
      <input id="title" name="title" />
      <label htmlFor="description">설명</label>
      <input id="description" name="description" />
      <label htmlFor="wordCount">읽은 단어 수</label>
      <input id="wordCount" name="wordCount" type="number" />
      <label htmlFor="speed">읽기 속도</label>
      <input id="speed" name="speed" type="number" />
      <label htmlFor="duration">세션 시간</label>
      <input id="duration" name="duration" type="number" />
      <label htmlFor="comprehension">이해도</label>
      <input id="comprehension" name="comprehension" type="number" />
      <label htmlFor="note">노트 내용</label>
      <textarea id="note" name="note" />
      <button type="submit">세션 저장</button>
    </form>
  );
}

export default SessionRecordForm; 