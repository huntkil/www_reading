// 세션 기록 입력 폼 관련 타입 정의

export interface SessionData {
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // 분 단위
  level: 'beginner' | 'intermediate' | 'advanced';
  wpm: number; // Words Per Minute
  accuracy: number; // 0-100%
  improvement: number; // 이전 대비 개선도 (%)
  techniques: string[]; // 사용한 기법들
  notes: string; // 메모
}

export interface FormField {
  name: keyof SessionData;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'time' | 'date';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ValidationError {
  field: keyof SessionData;
  message: string;
}

export interface SessionFormProps {
  onSubmit: (data: SessionData) => void;
  initialData?: Partial<SessionData>;
  isLoading?: boolean;
} 