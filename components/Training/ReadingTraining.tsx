'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Clock, Target, BookOpen, CheckCircle, ArrowLeft, Play, Pause, RotateCcw, Timer, Brain } from "lucide-react"
import { ReadingChapter } from '@/lib/readingMaterials'

interface ReadingTrainingProps {
  chapter: ReadingChapter
  onComplete: (stats: { wpm: number; accuracy: number; chapter: string }) => void
  onBack: () => void
}

export function ReadingTraining({ chapter, onComplete, onBack }: ReadingTrainingProps) {
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'reading' | 'comprehension' | 'complete'>('preparation')
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [pauseTime, setPauseTime] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [textAnswers, setTextAnswers] = useState<string[]>([])
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(0)

  const startReading = () => {
    setCurrentPhase('reading')
    setStartTime(Date.now())
  }

  const finishReading = () => {
    setEndTime(Date.now())
    setCurrentPhase('comprehension')
  }

  const togglePause = () => {
    if (isPaused) {
      setPauseTime(prev => prev + (Date.now() - (pauseTime || Date.now())))
    } else {
      setPauseTime(Date.now())
    }
    setIsPaused(!isPaused)
  }

  const resetReading = () => {
    setStartTime(null)
    setEndTime(null)
    setIsPaused(false)
    setPauseTime(0)
    setCurrentPhase('preparation')
  }

  const handleAnswerChange = (index: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleTextAnswerChange = (index: number, value: string) => {
    const newTextAnswers = [...textAnswers]
    newTextAnswers[index] = value
    setTextAnswers(newTextAnswers)
  }

  const calculateComprehensionScore = () => {
    if (!chapter.questions) return 0
    
    let correct = 0
    chapter.questions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correct++
      }
    })
    
    return Math.round((correct / chapter.questions.length) * 100)
  }

  const submitComprehension = () => {
    const comprehensionScore = calculateComprehensionScore()
    setAccuracy(comprehensionScore)
    setCurrentPhase('complete')
  }

  const calculateWPM = useCallback(() => {
    if (!startTime || !endTime) return 0
    
    const totalTime = endTime - startTime - pauseTime
    const minutes = totalTime / 60000 // Convert to minutes
    const wordCount = chapter.content.split(/\s+/).length
    
    return Math.round(wordCount / minutes)
  }, [startTime, endTime, pauseTime, chapter.content])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getElapsedTime = () => {
    if (!startTime) return 0
    const now = isPaused ? pauseTime : Date.now()
    return Math.floor((now - startTime) / 1000)
  }

  useEffect(() => {
    if (currentPhase === 'reading' && !isPaused) {
      const timer = setInterval(() => {
        // Timer updates automatically
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentPhase, isPaused])

  useEffect(() => {
    if (currentPhase === 'complete') {
      const calculatedWpm = calculateWPM()
      setWpm(calculatedWpm)
    }
  }, [currentPhase, calculateWPM])

  const handleSessionComplete = () => {
    onComplete({
      wpm,
      accuracy,
      chapter: chapter.title
    })
  }

  if (currentPhase === 'preparation') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로 가기
          </Button>
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>읽기 준비</span>
            </CardTitle>
            <CardDescription>
              선택한 챕터에 대한 정보를 확인하고 읽기를 시작하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">예상 시간: {chapter.estimatedTime}분</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">난이도: {chapter.difficulty}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">이해도 질문: {chapter.questions?.length || 0}개</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">읽기 내용 미리보기</Label>
              <div className="p-4 bg-muted rounded-lg max-h-40 overflow-y-auto">
                <p className="text-sm text-muted-foreground">
                  {chapter.content.substring(0, 300)}...
                </p>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                <strong>훈련 방법:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• 시작 버튼을 누르면 타이머가 시작됩니다</li>
                  <li>• 텍스트를 읽은 후 "읽기 완료" 버튼을 누르세요</li>
                  <li>• 이해도 질문에 답한 후 결과를 확인하세요</li>
                  <li>• WPM(분당 단어 수)과 이해도를 측정합니다</li>
                </ul>
              </AlertDescription>
            </Alert>

            <Button onClick={startReading} size="lg" className="w-full">
              <Play className="mr-2 h-4 w-4" />
              읽기 시작
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentPhase === 'reading') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              뒤로 가기
            </Button>
            <h2 className="text-2xl font-bold">{chapter.title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-lg font-mono">{formatTime(getElapsedTime())}</span>
            <Button variant="outline" size="sm" onClick={togglePause}>
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>읽기 중</span>
            </CardTitle>
            <CardDescription>
              텍스트를 읽은 후 "읽기 완료" 버튼을 눌러주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="p-6 bg-muted rounded-lg max-h-96 overflow-y-auto leading-relaxed">
                {chapter.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button onClick={finishReading} size="lg">
                <CheckCircle className="mr-2 h-4 w-4" />
                읽기 완료
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentPhase === 'comprehension') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로 가기
          </Button>
          <h2 className="text-2xl font-bold">이해도 확인</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>이해도 질문</span>
            </CardTitle>
            <CardDescription>
              읽은 내용을 바탕으로 다음 질문들에 답해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {chapter.questions?.map((question, index) => (
              <div key={index} className="space-y-3">
                <Label className="text-base font-medium">
                  {index + 1}. {question.question}
                </Label>
                <RadioGroup
                  value={answers[index]?.toString() || ''}
                  onValueChange={(value) => handleAnswerChange(index, parseInt(value))}
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={optionIndex.toString()} id={`q${index}_${optionIndex}`} />
                      <Label htmlFor={`q${index}_${optionIndex}`} className="text-sm">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="flex justify-center">
              <Button onClick={submitComprehension} size="lg">
                <CheckCircle className="mr-2 h-4 w-4" />
                답변 제출
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentPhase === 'complete') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            뒤로 가기
          </Button>
          <h2 className="text-2xl font-bold">훈련 완료</h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>훈련 결과</span>
            </CardTitle>
            <CardDescription>
              {chapter.title} 읽기 훈련이 완료되었습니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    <span className="text-lg font-semibold">읽기 속도</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{wpm} WPM</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    분당 단어 수
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-semibold">이해도</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600 mt-2">{accuracy}%</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    정답률
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">성과 분석</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">읽기 시간:</span>
                  <span className="text-sm font-medium">{formatTime(getElapsedTime())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">총 단어 수:</span>
                  <span className="text-sm font-medium">{chapter.content.split(/\s+/).length}개</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">예상 시간:</span>
                  <span className="text-sm font-medium">{chapter.estimatedTime}분</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={resetReading}>
                <RotateCcw className="mr-2 h-4 w-4" />
                다시 읽기
              </Button>
              <Button onClick={handleSessionComplete}>
                <CheckCircle className="mr-2 h-4 w-4" />
                완료
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
} 