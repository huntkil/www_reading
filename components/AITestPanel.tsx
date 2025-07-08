"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  Play, 
  CheckCircle, 
  XCircle,
  Loader2,
  Settings
} from 'lucide-react';
import { getAIStatus } from '@/lib/ai/analysis';

export function AITestPanel() {
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    success: boolean;
    message: string;
    data?: unknown;
  }>>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // 테스트용 데이터
  const [sessionData, setSessionData] = useState({
    duration: 30,
    wordsRead: 1500,
    comprehensionScore: 85,
    notes: '이번 세션에서는 속도 향상에 집중했습니다. 이해도는 양호한 편입니다.'
  });

  const [userProfile, setUserProfile] = useState({
    level: 'intermediate',
    goals: ['속도 향상', '이해도 개선'],
    preferences: ['실용적 조언', '구체적 팁']
  });

  const [preferences, setPreferences] = useState(['기술', '과학', '자기계발']);

  const addTestResult = (test: string, success: boolean, message: string, data?: unknown) => {
    setTestResults(prev => [...prev, { test, success, message, data }]);
  };

  const runAITests = async () => {
    const aiStatus = getAIStatus();
    
    if (!aiStatus.configured) {
      addTestResult('AI 설정 확인', false, 'OpenAI API 키가 설정되지 않았습니다. .env 파일에 OPENAI_API_KEY를 추가해주세요.');
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // 1. AI 설정 확인
      addTestResult('AI 설정 확인', true, `AI 모델: ${aiStatus.model}, 최대 토큰: ${aiStatus.maxTokens}`);

      // 2. 세션 분석 테스트
      try {
        const response = await fetch('/api/ai/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionData, userProfile })
        });

        const result = await response.json();
        
        if (result.success) {
          addTestResult('세션 분석', true, 'AI 세션 분석이 성공했습니다.', result.analysis);
        } else {
          addTestResult('세션 분석', false, `분석 실패: ${result.error}`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          addTestResult('세션 분석', false, `API 호출 실패: ${error.message}`);
        } else {
          addTestResult('세션 분석', false, `API 호출 실패: 알 수 없는 오류`);
        }
      }

      // 3. 훈련 계획 생성 테스트
      try {
        const response = await fetch('/api/ai/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userProfile, 
            sessionHistory: [
              { duration: 25, comprehensionScore: 80, date: '2025-07-01' },
              { duration: 30, comprehensionScore: 85, date: '2025-07-03' },
              { duration: 28, comprehensionScore: 82, date: '2025-07-05' }
            ]
          })
        });

        const result = await response.json();
        
        if (result.success) {
          addTestResult('훈련 계획 생성', true, 'AI 훈련 계획 생성이 성공했습니다.', result.plan);
        } else {
          addTestResult('훈련 계획 생성', false, `계획 생성 실패: ${result.error}`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          addTestResult('훈련 계획 생성', false, `API 호출 실패: ${error.message}`);
        } else {
          addTestResult('훈련 계획 생성', false, `API 호출 실패: 알 수 없는 오류`);
        }
      }

      // 4. 콘텐츠 추천 테스트
      try {
        const response = await fetch('/api/ai/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userProfile, preferences })
        });

        const result = await response.json();
        
        if (result.success) {
          addTestResult('콘텐츠 추천', true, 'AI 콘텐츠 추천이 성공했습니다.', result.recommendations);
        } else {
          addTestResult('콘텐츠 추천', false, `추천 실패: ${result.error}`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          addTestResult('콘텐츠 추천', false, `API 호출 실패: ${error.message}`);
        } else {
          addTestResult('콘텐츠 추천', false, `API 호출 실패: 알 수 없는 오류`);
        }
      }

    } catch (error: unknown) {
      if (error instanceof Error) {
        addTestResult('전체 테스트', false, `테스트 실행 중 오류 발생: ${error.message}`);
      } else {
        addTestResult('전체 테스트', false, `테스트 실행 중 오류 발생: 알 수 없는 오류`);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const successCount = testResults.filter(r => r.success).length;
  const totalCount = testResults.length;
  const aiStatus = getAIStatus();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI 서비스 테스트
          {totalCount > 0 && (
            <Badge variant={successCount === totalCount ? "default" : "secondary"}>
              {successCount}/{totalCount} 성공
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* AI 설정 상태 */}
        <Alert variant={aiStatus.configured ? "default" : "destructive"}>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            {aiStatus.configured 
              ? `AI 설정됨 - 모델: ${aiStatus.model}` 
              : 'OpenAI API 키가 설정되지 않았습니다. .env 파일에 OPENAI_API_KEY를 추가해주세요.'
            }
          </AlertDescription>
        </Alert>

        {/* 세션 데이터 입력 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">읽기 시간 (분)</label>
            <Input
              type="number"
              value={sessionData.duration}
              onChange={(e) => setSessionData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">읽은 단어 수</label>
            <Input
              type="number"
              value={sessionData.wordsRead}
              onChange={(e) => setSessionData(prev => ({ ...prev, wordsRead: parseInt(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">이해도 점수 (0-100)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={sessionData.comprehensionScore}
              onChange={(e) => setSessionData(prev => ({ ...prev, comprehensionScore: parseInt(e.target.value) || 0 }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">사용자 수준</label>
            <Input
              value={userProfile.level}
              onChange={(e) => setUserProfile(prev => ({ ...prev, level: e.target.value }))}
              placeholder="beginner/intermediate/advanced"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">세션 노트</label>
          <Textarea
            value={sessionData.notes}
            onChange={(e) => setSessionData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="이번 세션에 대한 노트를 입력하세요..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">선호 콘텐츠 (쉼표로 구분)</label>
          <Input
            value={preferences.join(', ')}
            onChange={(e) => setPreferences(e.target.value.split(',').map(p => p.trim()).filter(p => p))}
            placeholder="기술, 과학, 자기계발"
          />
        </div>

        {/* 테스트 버튼들 */}
        <div className="flex gap-2">
          <Button 
            onClick={runAITests} 
            disabled={!aiStatus.configured || isRunning}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                AI 테스트 실행 중...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                AI 기능 테스트 실행
              </>
            )}
          </Button>
          
          <Button 
            onClick={clearResults} 
            variant="outline"
            disabled={testResults.length === 0}
          >
            결과 지우기
          </Button>
        </div>

        {/* 테스트 결과 */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">테스트 결과</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.success 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">{result.test}</span>
                  </div>
                  <p className="text-sm text-gray-600">{result.message}</p>
                  {result.data !== undefined && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">
                        AI 응답 보기
                      </summary>
                      <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {JSON.stringify(result.data as any, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 