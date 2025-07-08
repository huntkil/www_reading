import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { SessionData, SessionFormProps, ValidationError } from './types';

const TECHNIQUE_OPTIONS = [
  { value: 'visual-reading', label: '시각적 읽기' },
  { value: 'chunking', label: '단어 덩어리 인식' },
  { value: 'speed-reading', label: '속도 읽기' },
  { value: 'comprehension-focus', label: '이해도 중심' },
  { value: 'metronome', label: '메트로놈 리듬' },
  { value: 'finger-guiding', label: '손가락 가이드' },
];

const LEVEL_OPTIONS = [
  { value: 'beginner', label: '초급' },
  { value: 'intermediate', label: '중급' },
  { value: 'advanced', label: '고급' },
];

export function SessionForm({ onSubmit, initialData, isLoading = false }: SessionFormProps) {
  const [formData, setFormData] = useState<SessionData>({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    duration: 0,
    level: 'beginner',
    wpm: 0,
    accuracy: 0,
    improvement: 0,
    techniques: [],
    notes: '',
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: ValidationError[] = [];

    if (!formData.date) {
      newErrors.push({ field: 'date', message: '날짜를 입력해주세요.' });
    }

    if (!formData.startTime) {
      newErrors.push({ field: 'startTime', message: '시작 시간을 입력해주세요.' });
    }

    if (!formData.endTime) {
      newErrors.push({ field: 'endTime', message: '종료 시간을 입력해주세요.' });
    }

    if (formData.wpm <= 0) {
      newErrors.push({ field: 'wpm', message: '읽기 속도를 입력해주세요.' });
    }

    if (formData.accuracy < 0 || formData.accuracy > 100) {
      newErrors.push({ field: 'accuracy', message: '정확도는 0-100 사이의 값이어야 합니다.' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleInputChange = (field: keyof SessionData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // 에러 제거
    setErrors(prev => prev.filter(error => error.field !== field));
  };

  const handleTechniqueChange = (technique: string) => {
    setFormData(prev => ({
      ...prev,
      techniques: prev.techniques.includes(technique)
        ? prev.techniques.filter(t => t !== technique)
        : [...prev.techniques, technique]
    }));
  };

  const getFieldError = (field: keyof SessionData) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          학습 세션 기록
        </h2>
        <p className="text-muted-foreground">
          오늘의 속발음 해결 훈련 세션을 기록해보세요.
        </p>
      </div>

      {/* 날짜 */}
      <div className="space-y-2">
        <Label htmlFor="date">날짜</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          className={getFieldError('date') ? 'border-red-500' : ''}
        />
        {getFieldError('date') && (
          <p className="text-sm text-red-500">{getFieldError('date')}</p>
        )}
      </div>

      {/* 시간 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">시작 시간</Label>
          <Input
            id="startTime"
            type="time"
            value={formData.startTime}
            onChange={(e) => handleInputChange('startTime', e.target.value)}
            className={getFieldError('startTime') ? 'border-red-500' : ''}
          />
          {getFieldError('startTime') && (
            <p className="text-sm text-red-500">{getFieldError('startTime')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">종료 시간</Label>
          <Input
            id="endTime"
            type="time"
            value={formData.endTime}
            onChange={(e) => handleInputChange('endTime', e.target.value)}
            className={getFieldError('endTime') ? 'border-red-500' : ''}
          />
          {getFieldError('endTime') && (
            <p className="text-sm text-red-500">{getFieldError('endTime')}</p>
          )}
        </div>
      </div>

      {/* 레벨 */}
      <div className="space-y-2">
        <Label htmlFor="level">연습 레벨</Label>
        <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
          <SelectTrigger>
            <SelectValue placeholder="레벨을 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {LEVEL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 성과 지표 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          {/* <Target className="h-5 w-5" /> */}
          성과 지표
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="wpm">읽기 속도 (WPM)</Label>
            <Input
              id="wpm"
              type="number"
              min="0"
              step="1"
              value={formData.wpm}
              onChange={(e) => handleInputChange('wpm', Number(e.target.value))}
              placeholder="예: 200"
              className={getFieldError('wpm') ? 'border-red-500' : ''}
            />
            {getFieldError('wpm') && (
              <p className="text-sm text-red-500">{getFieldError('wpm')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="accuracy">정확도 (%)</Label>
            <Input
              id="accuracy"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={formData.accuracy}
              onChange={(e) => handleInputChange('accuracy', Number(e.target.value))}
              placeholder="예: 85.5"
              className={getFieldError('accuracy') ? 'border-red-500' : ''}
            />
            {getFieldError('accuracy') && (
              <p className="text-sm text-red-500">{getFieldError('accuracy')}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="improvement">개선도 (%)</Label>
            <Input
              id="improvement"
              type="number"
              step="0.1"
              value={formData.improvement}
              onChange={(e) => handleInputChange('improvement', Number(e.target.value))}
              placeholder="예: 15.2"
            />
          </div>
        </div>
      </div>

      {/* 사용한 기법 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          사용한 기법
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TECHNIQUE_OPTIONS.map((technique) => (
            <label key={technique.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.techniques.includes(technique.value)}
                onChange={() => handleTechniqueChange(technique.value)}
                className="rounded"
              />
              <span className="text-sm">{technique.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 메모 */}
      <div className="space-y-2">
        <Label htmlFor="notes">오늘의 느낀 점</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="오늘 훈련에서 느낀 점이나 개선 사항을 기록해보세요..."
          rows={4}
        />
      </div>

      {/* 제출 버튼 */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          {isLoading ? '저장 중...' : '세션 저장'}
        </Button>
      </div>
    </form>
  );
} 