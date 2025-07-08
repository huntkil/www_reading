'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, BookOpen, HelpCircle } from 'lucide-react';
import ChapterSelector from './ChapterSelector';
import TrainingHelpModal from './TrainingHelpModal';
import { Chapter } from '@/lib/readingMaterials';

interface TrainingSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionType: 'quick' | 'speed' | 'custom';
  userLevel?: string;
  customExercises?: Exercise[];
}

interface Exercise {
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  sampleText?: string;
}

export default function TrainingSessionModal({
  isOpen,
  onClose,
  sessionType,
  customExercises,
}: TrainingSessionModalProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'exercise' | 'completion'>('preparation');
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const trainingPrograms: { [key: string]: Exercise[] } = {
    quick: [
      {
        name: '읽기 패턴 진단',
        description: '현재 읽기 방식을 파악하고 개선점을 찾습니다',
        duration: '5',
        difficulty: '초급',
        sampleText: `빠른 읽기 기술의 핵심은 효율적인 정보 처리 방식에 있습니다. 전통적인 읽기 방법에서는 각 단어를 개별적으로 발음하면서 읽는 경향이 있습니다. 이러한 방식은 읽기 속도를 크게 제한할 수 있습니다.`
      },
      {
        name: '페이서 훈련',
        description: '손가락이나 펜으로 텍스트를 따라가며 읽기 리듬을 개선합니다',
        duration: '10',
        difficulty: '초급',
        sampleText: `인지과학 연구는 읽기 과정에서 발생하는 여러 현상을 밝혀냈습니다. 우리의 뇌는 텍스트를 처리할 때 여러 단계를 거칩니다. 먼저 시각적 정보를 받아들이고, 이를 의미 있는 단위로 해석하며, 최종적으로 이해와 기억으로 연결합니다.`
      },
      {
        name: '의미 단위 읽기',
        description: '단어별 읽기에서 의미 단위 읽기로 전환합니다',
        duration: '10',
        difficulty: '중급',
        sampleText: `독서는 인간의 지적 발전에 핵심적인 역할을 합니다. 우리는 책을 통해 새로운 지식을 습득하고, 다른 사람의 경험과 생각을 이해하며, 자신의 사고를 확장시킬 수 있습니다.`
      }
    ],
    speed: [
        {
            name: '인지 병목 현상 이해',
            description: '읽기 속도를 제한하는 인지적 요소들을 학습합니다',
            duration: '5',
            difficulty: '중급',
            sampleText: `인지과학자들은 읽기 과정을 여러 단계로 분석했습니다. 첫 번째 단계는 시각적 인식입니다. 우리의 눈은 텍스트의 형태를 뇌로 전송합니다.`
        },
        {
            name: '시각화 훈련',
            description: '텍스트를 이미지나 영상으로 변환하여 직관적 이해를 촉진합니다',
            duration: '15',
            difficulty: '중급',
            sampleText: `고대 로마의 도시는 놀라운 공학적 업적의 현장이었습니다. 거대한 콜로세움은 수만 명의 관중을 수용할 수 있었고, 복잡한 지하 시스템을 통해 글래디에이터와 동물들이 등장했습니다.`
        },
        {
            name: '적응적 속도 훈련',
            description: '텍스트 유형과 목적에 따라 읽기 속도를 조절합니다',
            duration: '15',
            difficulty: '고급',
            sampleText: `양자역학은 현대 물리학의 가장 혁신적인 이론 중 하나입니다. 이 이론은 20세기 초 막스 플랑크의 양자 가설에서 시작되었으며, 뛰어난 물리학자들에 의해 발전되었습니다.`
        }
    ],
    custom: [],
  };

  const exercises = sessionType === 'custom' && customExercises?.length
    ? customExercises
    : trainingPrograms[sessionType] || [];
  
  const totalDurationMinutes = exercises.reduce((acc, ex) => acc + parseInt(ex.duration), 0);

  useEffect(() => {
    if (isActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
        const totalElapsed = (totalDurationMinutes * 60) - timeRemaining;
        setProgress((totalElapsed / (totalDurationMinutes * 60)) * 100);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isActive && timeRemaining === 0) {
      if (currentExercise < exercises.length - 1) {
        setCurrentExercise(currentExercise + 1);
        setTimeRemaining(parseInt(exercises[currentExercise + 1].duration) * 60);
      } else {
        setIsActive(false);
        setCurrentPhase('completion');
      }
    }
  }, [isActive, timeRemaining, currentExercise, exercises, totalDurationMinutes]);

  const startSession = () => {
    // For now, let's auto-select a dummy chapter to proceed
    if (!selectedChapter) {
        setShowChapterSelector(true);
        return;
    }
    setIsActive(true);
    setCurrentExercise(0);
    setTimeRemaining(parseInt(exercises[0].duration) * 60);
    setProgress(0);
    setCurrentPhase('exercise');
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setShowChapterSelector(false);
  };

  const pauseSession = () => setIsActive(false);

  const stopSession = () => {
    setIsActive(false);
    setCurrentExercise(0);
    setTimeRemaining(0);
    setProgress(0);
    setCurrentPhase('preparation');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getSessionTitle = () => {
    if (sessionType === 'quick') return '빠른 시작 훈련';
    if (sessionType === 'speed') return '속도 향상 훈련';
    return '맞춤형 훈련';
  };

  const getSessionDescription = () => {
    if (sessionType === 'quick') return '연구 기반 기본 읽기 능력 향상 훈련입니다.';
    if (sessionType === 'speed') return '인지 병목 현상을 극복하고 시각적 처리를 강화하는 훈련입니다.';
    return '개인 맞춤형 읽기 최적화 훈련입니다.';
  };
  
  const currentExerciseData = exercises[currentExercise];

  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-5/6 flex flex-col">
        {currentPhase === 'completion' ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>훈련 완료</DialogTitle>
              <DialogDescription>훈련 세션이 완료되었습니다.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <h2 className="text-2xl font-bold mb-4">훈련 완료!</h2>
              <p className="text-muted-foreground mb-6">수고하셨습니다. 오늘의 훈련 세션을 성공적으로 마쳤습니다.</p>
              <Button onClick={onClose}>닫기</Button>
            </div>
          </>
        ) : !currentExerciseData ? (
            <>
              <DialogHeader className="sr-only">
                <DialogTitle>훈련 데이터 없음</DialogTitle>
                <DialogDescription>선택된 훈련에 대한 데이터가 없습니다.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <h2 className="text-2xl font-bold mb-4">훈련 준비 중</h2>
                  <p className="text-muted-foreground mb-6">선택된 훈련 유형에 대한 연습이 없습니다.</p>
                  <Button onClick={onClose}>닫기</Button>
              </div>
            </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between w-full">
                <span className="flex items-center gap-2">
                  {getSessionTitle()}
                </span>
                <Button variant="outline" size="sm" onClick={() => setShowChapterSelector(true)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  자료 변경
                </Button>
              </DialogTitle>
              <DialogDescription>{getSessionDescription()}</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow overflow-hidden">
              <div className="md:col-span-1 h-full overflow-y-auto pr-4">
                <h3 className="text-lg font-semibold mb-4">훈련 단계</h3>
                <ol className="space-y-3">
                  {exercises.map((exercise, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        index < currentExercise ? 'bg-green-500 text-white' : 
                        index === currentExercise && isActive ? 'bg-blue-500 text-white animate-pulse' :
                        index === currentExercise ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className={`font-medium ${index === currentExercise ? 'text-blue-600' : ''}`}>{exercise.name}</p>
                        <p className="text-sm text-muted-foreground">{exercise.duration}분</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="md:col-span-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-6 h-full flex flex-col overflow-hidden">
                <div className="flex-grow overflow-y-auto">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold">{currentExerciseData.name}</h4>
                      <p className="text-muted-foreground">{currentExerciseData.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{currentExerciseData.difficulty}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowHelpModal(true)}
                        className="h-8 w-8 p-0"
                      >
                        <HelpCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-semibold mb-2">훈련 텍스트</h5>
                    <Card className="bg-white dark:bg-gray-800">
                      <CardContent className="p-4 whitespace-pre-wrap font-serif text-base leading-relaxed max-h-60 overflow-y-auto">
                        {selectedChapter?.content || currentExerciseData.sampleText}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="w-1/3">
                      <p className="text-sm font-medium">남은 시간</p>
                      <p className="text-2xl font-bold">{formatTime(timeRemaining)}</p>
                    </div>
                    <div className="flex gap-2">
                      {!isActive ? (
                        <Button size="lg" onClick={startSession}><Play className="mr-2 h-5 w-5" /> 시작</Button>
                      ) : (
                        <>
                          <Button size="lg" variant="outline" onClick={pauseSession}><Pause className="mr-2 h-5 w-5" /> 일시정지</Button>
                          <Button size="lg" variant="destructive" onClick={stopSession}><Square className="mr-2 h-5 w-5" /> 중지</Button>
                        </>
                      )}
                    </div>
                    <div className="w-1/3 text-right">
                       <Button variant="ghost" disabled>
                        <BookOpen className="mr-2 h-4 w-4" /> 자료 변경
                      </Button>
                    </div>
                  </div>
                  <Progress value={progress} className="mt-4" />
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
      {showChapterSelector && (
        <Dialog open={showChapterSelector} onOpenChange={setShowChapterSelector}>
            <DialogContent className="max-w-4xl h-5/6 flex flex-col">
                <DialogHeader>
                    <DialogTitle>훈련 자료 선택</DialogTitle>
                    <DialogDescription>
                    훈련에 사용할 챕터를 선택하세요.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-grow overflow-y-auto">
                    <ChapterSelector onChapterSelect={handleChapterSelect} selectedChapter={selectedChapter || undefined} />
                </div>
            </DialogContent>
        </Dialog>
      )}
      <TrainingHelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        exerciseName={currentExerciseData?.name || ''}
        sessionType={sessionType}
      />
    </Dialog>
  );
} 