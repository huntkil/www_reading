'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, CheckCircle, HelpCircle } from "lucide-react"
import { TrainingPlan } from '@/lib/types';
import TrainingHelpModal from './TrainingHelpModal';

const trainingTexts = [
  "속발음은 읽기 속도를 저하시키는 주요 원인 중 하나입니다. 속발음은 내면에서 단어를 소리내어 읽는 습관으로, 이를 제거하면 읽기 속도를 크게 향상시킬 수 있습니다. 이 훈련에서는 빠른 속도로 텍스트를 읽으면서 속발음을 억제하는 연습을 합니다.",
  "효과적인 읽기를 위해서는 시각적 인식 능력을 향상시켜야 합니다. 단어를 하나씩 읽는 대신, 문장 전체를 한 번에 파악하는 연습이 필요합니다. 이는 초기에는 어려울 수 있지만, 지속적인 연습을 통해 자연스럽게 습득할 수 있습니다.",
  "읽기 속도 향상의 핵심은 집중력과 시각적 처리 능력입니다. 텍스트를 읽을 때 불필요한 속발음을 제거하고, 시각적으로 정보를 처리하는 능력을 기르는 것이 중요합니다. 매일 15-20분씩 연습하면 점진적으로 개선될 것입니다."
];

interface TrainingSessionProps {
  plan: TrainingPlan | null
  onSessionComplete: (stats: { wpm: number; accuracy: number }) => void
}

export function TrainingSession({ plan, onSessionComplete }: TrainingSessionProps) {
  const [timeLeft, setTimeLeft] = useState(plan ? plan.duration * 60 : 300);
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{type: 'error' | 'success' | 'info', message: string} | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    setCurrentText(trainingTexts[Math.floor(Math.random() * trainingTexts.length)]);
    setTimeLeft(plan ? plan.duration * 60 : 300);
  }, [plan]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!startTime) {
      setStartTime(new Date());
    }
    setUserInput(e.target.value);
  };

  const calculateStats = useCallback(() => {
    const words = userInput.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    const elapsedTime = startTime ? (new Date().getTime() - startTime.getTime()) / 1000 / 60 : 0; // minutes
    const currentWpm = elapsedTime > 0 ? Math.round(wordCount / elapsedTime) : 0;
    setWpm(currentWpm);
    
    let correctChars = 0;
    let hasError = false;
    const originalTextSlice = currentText.slice(0, userInput.length);
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === originalTextSlice[i]) {
        correctChars++;
      } else {
        hasError = true;
      }
    }
    const currentAccuracy = originalTextSlice.length > 0 ? (correctChars / originalTextSlice.length) * 100 : 0;
    setAccuracy(parseFloat(currentAccuracy.toFixed(2)));

    // 실시간 피드백 로직
    if (hasError) {
      setFeedbackMessage({ type: 'error', message: '오타가 있습니다. 다시 확인해보세요.' });
    } else if (currentAccuracy > 98 && wordCount > 5) {
      setFeedbackMessage({ type: 'success', message: '훌륭합니다! 계속 진행하세요.' });
    } else if (plan && currentWpm > plan.targetWpm * 0.9 && currentWpm < plan.targetWpm) {
      setFeedbackMessage({ type: 'info', message: '목표 WPM에 거의 도달했어요!' });
    } else {
      setFeedbackMessage(null);
    }
    return { wpm: currentWpm, accuracy: currentAccuracy };
  }, [userInput, currentText, plan, startTime]);

  const handleFinish = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    const stats = calculateStats();
    onSessionComplete(stats);
  }, [isFinished, onSessionComplete, calculateStats]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isFinished) {
      handleFinish();
    }
  }, [timeLeft, isFinished, handleFinish]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isFinished) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Alert className="max-w-md">
           <CheckCircle className="h-4 w-4" />
          <AlertTitle>훈련 완료!</AlertTitle>
          <AlertDescription>
            <div className="space-y-2 mt-4">
               <p>WPM: {wpm}</p>
               <p>정확도: {accuracy}%</p>
               <p className="pt-4 text-sm">결과가 대시보드에 저장되었습니다.</p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{plan?.title || '훈련 세션'}</CardTitle>
              <CardDescription>
                {plan?.content || '집중해서 텍스트를 읽고 따라 입력하세요.'}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelpModal(true)}
              className="h-8 w-8 p-0"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">시간</p>
                <p className="text-2xl font-bold">{formatTime(timeLeft)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">목표 WPM</p>
                <p className="text-2xl font-bold">{plan?.targetWpm || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">현재 WPM</p>
                <p className="text-2xl font-bold">{wpm}</p>
              </div>
            </div>
            
            <div className="relative">
               <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md font-mono text-gray-500 select-none">
                 {currentText}
               </p>
                <div className="absolute top-0 left-0 p-4 font-mono text-transparent">
                  {userInput.split('').map((char, index) => (
                    <span key={index} className={char === currentText[index] ? 'text-green-500' : 'text-red-500'}>
                      {currentText[index]}
                    </span>
                  ))}
                </div>
            </div>


            <textarea
              className="w-full p-4 font-mono bg-white dark:bg-gray-900 border rounded-md"
              rows={8}
              value={userInput}
              onChange={handleInputChange}
              placeholder="여기에 텍스트를 입력하세요..."
              disabled={isFinished}
            />
            {feedbackMessage && (
              <Alert variant={feedbackMessage.type === 'error' ? 'destructive' : 'default'} className={`mt-4 ${feedbackMessage.type === 'success' ? 'bg-green-100 dark:bg-green-900' : ''}`}>
                <Terminal className="h-4 w-4" />
                <AlertTitle>{feedbackMessage.type === 'error' ? '실수 발견!' : feedbackMessage.type === 'success' ? '잘하고 있어요!' : '팁'}</AlertTitle>
                <AlertDescription>
                  {feedbackMessage.message}
                </AlertDescription>
              </Alert>
            )}
            <div className="flex items-center space-x-4">
              <Progress value={accuracy} className="w-full" />
              <span className="text-sm font-semibold">{accuracy}%</span>
            </div>
            <Button onClick={handleFinish} className="w-full" disabled={isFinished}>
              훈련 종료
            </Button>
          </div>
        </CardContent>
      </Card>
      <TrainingHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        exerciseName={plan?.title || '훈련 세션'}
        sessionType="custom"
      />
    </div>
  )
} 