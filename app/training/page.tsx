'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from "@/components/ui/badge"

import { Brain, Eye, Target, BookOpen, HelpCircle, GraduationCap, FileText, CheckCircle } from "lucide-react"
import { TrainingSession, TrainingModule } from '@/components/Training/TrainingSession'

import { ReadingSelector } from '@/components/Training/ReadingSelector'
import { ReadingTraining } from '@/components/Training/ReadingTraining'
import { TrainingPlan } from '@/lib/types'
import { ReadingChapter } from '@/lib/readingMaterials'
import TrainingHelpModal from '@/components/Training/TrainingHelpModal'



type TrainingStep = 'select-type' | 'select-module' | 'select-reading' | 'training' | 'reading-training'
type TrainingType = 'module' | 'reading'

export default function TrainingPage() {
  const [currentStep, setCurrentStep] = useState<TrainingStep>('select-type')
  const [trainingType, setTrainingType] = useState<TrainingType | null>(null)

  const [plan, setPlan] = useState<TrainingPlan | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<ReadingChapter | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  // 훈련 모듈 정의
  const trainingModules: TrainingModule[] = [
    {
      id: 'module1',
      title: "기초 속발음 제어 훈련",
      description: "내면의 목소리를 이해하고 효율적으로 관리하는 방법을 학습합니다.",
      difficulty: "초급",
      duration: 15,
      icon: Brain,
      steps: [
        {
          id: 'step1_1',
          title: "속발음 이해하기",
          type: 'lesson',
          content: `
            <h3>속발음이란 무엇인가요?</h3>
            <p>속발음은 글을 읽을 때 머릿속에서 단어를 소리내어 읽는 현상입니다. 이는 두 가지 유형으로 나뉩니다:</p>
            <ul>
              <li><strong>병리적 속발음:</strong> 실제로 입술이나 혀가 움직이는 물리적 현상 (드물음)</li>
              <li><strong>정상적 묵독:</strong> 머릿속에서 목소리를 '듣는' 인지적 과정 (대부분의 경우)</li>
            </ul>
            <p>우리가 개선해야 할 것은 비효율적인 묵독 습관입니다.</p>
            
            <h3>음운 병목 현상</h3>
            <p>내면의 목소리가 처리하는 속도는 분당 150-250단어(WPM)로 제한됩니다. 이것이 읽기 속도를 제한하는 주요 원인입니다.</p>
          `
        },
        {
          id: 'step1_2',
          title: "물리적 속발음 억제 훈련",
          type: 'exercise',
          content: `
            <h3>껌 씹기 훈련</h3>
            <p>껌을 씹으면서 읽으면 발성 근육이 점유되어 속발음을 억제할 수 있습니다.</p>
            <p><strong>방법:</strong></p>
            <ol>
              <li>껌을 입에 넣고 천천히 씹기 시작</li>
              <li>일정한 리듬으로 씹으면서 텍스트 읽기</li>
              <li>내면의 목소리에 집중하지 말고 시각적 정보에 집중</li>
            </ol>
          `,
          readingText: "인지과학 연구에 따르면, 읽기 과정에서 발생하는 속발음은 뇌의 음운 고리(Phonological Loop)와 밀접한 관련이 있습니다. 이 시스템은 언어 정보를 소리 형태로 일시적으로 저장하고 처리하는 역할을 합니다. 배들리와 히치가 제안한 작업 기억 모델에서 음운 고리는 두 개의 하위 시스템으로 구성됩니다: 음운 저장소와 조음 통제 과정. 조음 통제 과정이 바로 우리가 경험하는 내면의 목소리, 즉 묵독 현상에 해당합니다. 이 과정은 시각적 정보(글자)를 음운 정보(소리)로 변환하여 음운 저장소에 저장하는 역할을 합니다. 따라서 속발음은 단순한 습관이 아니라 문장의 의미를 파악하고 여러 개념을 통합하는 핵심적인 인지 메커니즘입니다.",
          questions: [
            {
              question: "음운 고리의 두 하위 시스템은 무엇인가요?",
              options: [
                "음운 저장소와 조음 통제 과정",
                "시각 저장소와 청각 통제 과정", 
                "단기 기억과 장기 기억",
                "언어 처리와 의미 분석"
              ],
              correct: 0
            },
            {
              question: "조음 통제 과정의 주요 역할은 무엇인가요?",
              options: [
                "시각적 정보를 음운 정보로 변환",
                "장기 기억에 정보 저장",
                "감정적 반응 처리",
                "운동 기능 조절"
              ],
              correct: 0
            }
          ]
        }
      ]
    },
    {
      id: 'module2',
      title: "시각적 처리 및 청킹 훈련",
      description: "여러 단어를 동시에 인식하고 의미 단위로 처리하는 능력을 향상시킵니다.",
      difficulty: "중급",
      duration: 20,
      icon: Eye,
      steps: [
        {
          id: 'step2_1',
          title: "청킹(Chunking) 이해하기",
          type: 'lesson',
          content: `
            <h3>청킹이란 무엇인가요?</h3>
            <p>청킹은 여러 단어나 구문을 하나의 의미 단위로 인식하는 기법입니다. 이는 음운 병목 현상을 극복하는 핵심 전략입니다.</p>
            
            <h3>청킹의 원리</h3>
            <ul>
              <li><strong>의미 단위 처리:</strong> 개별 단어가 아닌 의미 있는 구문 단위로 읽기</li>
              <li><strong>시각적 확장:</strong> 한 번의 시선 고정으로 더 많은 정보 포착</li>
              <li><strong>예측적 읽기:</strong> 문맥을 통해 다음 내용을 미리 예측</li>
            </ul>
            
            <h3>단계별 발전</h3>
            <ol>
              <li>2-3단어 청킹 (초급)</li>
              <li>구문 단위 청킹 (중급)</li>
              <li>문장 단위 청킹 (고급)</li>
            </ol>
          `
        },
        {
          id: 'step2_2',
          title: "2-3단어 청킹 훈련",
          type: 'exercise',
          content: `
            <h3>기초 청킹 연습</h3>
            <p>2-3개의 단어를 하나의 단위로 인식하는 연습을 합니다.</p>
            <p><strong>방법:</strong></p>
            <ol>
              <li>텍스트에서 2-3단어씩 그룹화하여 읽기</li>
              <li>각 그룹을 하나의 의미 단위로 이해</li>
              <li>개별 단어에 집착하지 말고 전체 의미에 집중</li>
            </ol>
          `,
          readingText: "청킹 기법의 핵심은 개별 단어를 하나씩 읽는 대신 의미 있는 단위로 묶어서 처리하는 것입니다. 예를 들어 '빠른 읽기 기법'이라는 구문을 '빠른' + '읽기' + '기법'으로 나누어 읽는 대신, '빠른 읽기 기법'이라는 하나의 개념으로 인식하는 것입니다. 이 기법은 인지 부하를 줄이고 처리 속도를 향상시킵니다. 연구에 따르면 숙련된 독자들은 한 번의 시선 고정으로 평균 7-9개의 문자를 처리할 수 있습니다. 이는 초보 독자들의 3-4개 문자 처리 능력을 크게 상회하는 수치입니다. 청킹 훈련을 통해 시각적 인식 범위를 확장하고, 의미 기반의 읽기 패턴을 형성할 수 있습니다.",
          questions: [
            {
              question: "청킹 기법의 주요 목표는 무엇인가요?",
              options: [
                "개별 단어를 정확히 발음하기",
                "의미 있는 단위로 묶어서 처리하기",
                "모든 단어를 외우기",
                "읽기 속도를 무조건 빠르게 하기"
              ],
              correct: 1
            },
            {
              question: "숙련된 독자들이 한 번의 시선 고정으로 처리할 수 있는 문자 수는?",
              options: [
                "3-4개",
                "5-6개", 
                "7-9개",
                "10개 이상"
              ],
              correct: 2
            }
          ]
        }
      ]
    },
    {
      id: 'module3',
      title: "숙련된 읽기 및 스캐닝 훈련",
      description: "고급 읽기 기법과 정보 검색 능력을 향상시킵니다.",
      difficulty: "고급",
      duration: 25,
      icon: Target,
      steps: [
        {
          id: 'step3_1',
          title: "스캐닝 기법 이해하기",
          type: 'lesson',
          content: `
            <h3>스캐닝이란 무엇인가요?</h3>
            <p>스캐닝은 특정 정보를 빠르게 찾기 위해 텍스트를 체계적으로 검색하는 기법입니다.</p>
            
            <h3>스캐닝의 원리</h3>
            <ul>
              <li><strong>키워드 중심:</strong> 찾고자 하는 정보의 핵심 키워드에 집중</li>
              <li><strong>시각적 패턴:</strong> 숫자, 날짜, 이름 등 특정 패턴 인식</li>
              <li><strong>효율적 이동:</strong> 불필요한 부분을 건너뛰고 목표 지점으로 이동</li>
            </ul>
          `
        },
        {
          id: 'step3_2',
          title: "스캐닝 훈련",
          type: 'exercise',
          content: `
            <h3>스캐닝 연습</h3>
            <p>특정 정보를 빠르게 찾는 연습을 합니다.</p>
            <p><strong>방법:</strong></p>
            <ol>
              <li>찾고자 하는 정보의 키워드 파악</li>
              <li>텍스트를 빠르게 스캔하며 키워드 탐색</li>
              <li>관련 문장을 찾으면 정확히 읽기</li>
            </ol>
          `,
          readingText: "스캐닝은 효율적인 정보 검색을 위한 핵심 기법입니다. 이 기법은 전체 텍스트를 읽는 대신 특정 정보만을 빠르게 찾아내는 데 특화되어 있습니다. 스캐닝의 성공은 키워드 식별 능력과 시각적 패턴 인식 능력에 달려 있습니다. 예를 들어, 날짜를 찾을 때는 숫자 패턴에 집중하고, 이름을 찾을 때는 대문자로 시작하는 단어에 주목합니다. 연구에 따르면 숙련된 스캐닝 능력은 정보 검색 시간을 60-80% 단축시킬 수 있습니다. 이는 학업이나 업무에서 대량의 정보를 처리해야 할 때 매우 유용한 기술입니다.",
          questions: [
            {
              question: "스캐닝의 주요 목적은 무엇인가요?",
              options: [
                "전체 텍스트를 정확히 읽기",
                "특정 정보를 빠르게 찾기",
                "모든 단어를 외우기",
                "읽기 속도를 측정하기"
              ],
              correct: 1
            },
            {
              question: "스캐닝 성공의 핵심 요소는?",
              options: [
                "천천히 읽기",
                "키워드 식별과 패턴 인식",
                "모든 내용을 기억하기",
                "발음 연습하기"
              ],
              correct: 1
            }
          ]
        }
      ]
    }
  ]

  const handleTrainingTypeSelect = (type: TrainingType) => {
    setTrainingType(type)
    if (type === 'reading') {
      setCurrentStep('select-reading')
    } else {
      setCurrentStep('select-module')
    }
  }



  const handleReadingSelect = (chapter: ReadingChapter) => {
    setSelectedChapter(chapter)
    
    if (trainingType === 'reading') {
      // 학습용 리딩의 경우 바로 읽기 훈련 단계로 이동
      setCurrentStep('reading-training')
    } else {
      // 단계별 훈련의 경우 훈련 계획 생성 후 훈련 단계로 이동
      const newPlan: TrainingPlan = {
        title: trainingModules[0].title,
        targetWpm: 300,
        duration: trainingModules[0].duration,
        content: trainingModules[0].description
      }
      setPlan(newPlan)
      setCurrentStep('training')
    }
  }





  const handleSessionComplete = () => {
    resetTraining()
  }

  const handleReadingComplete = () => {
    resetTraining()
  }

  const resetTraining = () => {
    setCurrentStep('select-type')
    setTrainingType(null)
    setPlan(null)
    setSelectedChapter(null)
  }

  const goBack = () => {
    if (currentStep === 'select-module') {
      setCurrentStep('select-type')
      setTrainingType(null)
    } else if (currentStep === 'select-reading') {
      if (trainingType === 'module') {
        setCurrentStep('select-module')
      } else {
        setCurrentStep('select-type')
        setTrainingType(null)
      }
    } else if (currentStep === 'training') {
      setCurrentStep('select-reading')
      setPlan(null)
      setSelectedChapter(null)
    } else if (currentStep === 'reading-training') {
      setCurrentStep('select-reading')
      setSelectedChapter(null)
    }
  }

  const getStepProgress = () => {
    switch (currentStep) {
      case 'select-type': return 25
      case 'select-module': return 50
      case 'select-reading': return 75
      case 'training': return 100
      default: return 0
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'select-type': return '훈련 유형 선택'
      case 'select-module': return '훈련 모듈 선택'
      case 'select-reading': return '학습 자료 선택'
      case 'training': return '훈련 시작'
      default: return ''
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 'select-type': return '원하는 훈련 방식을 선택해주세요'
      case 'select-module': return '단계별 훈련 모듈을 선택하세요'
      case 'select-reading': return '학습할 리딩 자료를 선택하세요'
      case 'training': return '선택한 훈련을 시작합니다'
      default: return ''
    }
  }

  const getStepNumber = () => {
    switch (currentStep) {
      case 'select-type': return '1/4'
      case 'select-module': return '2/4'
      case 'select-reading': return '3/4'
      case 'training': return '4/4'
      default: return ''
    }
  }

  if (false) { // isLoading 제거
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">훈련을 준비하고 있습니다...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 진행 상황 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">읽기 훈련</h1>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelp(true)}
                className="flex items-center space-x-2"
              >
                <HelpCircle className="h-4 w-4" />
                <span>도움말</span>
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm text-muted-foreground">단계 {getStepNumber()}/4</span>
            <Progress value={getStepProgress()} className="flex-1" />
            <span className="text-sm font-medium">{getStepTitle()}</span>
          </div>
          <p className="text-sm text-muted-foreground">{getStepDescription()}</p>
        </div>

        {/* 훈련 타입 선택 */}
        {currentStep === 'select-type' && (
          <div className="space-y-6">
            {/* 훈련 타입 선택 가이드 */}
            <div className="bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">💡 훈련 방법 선택 가이드</h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    <strong>모듈 훈련:</strong> 체계적인 단계별 학습을 원한다면 선택하세요. 이론부터 실습까지 체계적으로 진행됩니다.<br/>
                    <strong>리딩 훈련:</strong> 다양한 읽기 자료로 직접 훈련하고 싶다면 선택하세요. 선택한 텍스트로 즉시 훈련을 시작합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  trainingType === 'module' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTrainingTypeSelect('module')}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle>모듈 훈련</CardTitle>
                      <CardDescription>체계적인 단계별 학습</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>이론부터 실습까지 체계적 진행</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>단계별 이해도 확인</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>개인 맞춤형 학습 경로</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  trainingType === 'reading' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleTrainingTypeSelect('reading')}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <CardTitle>리딩 훈련</CardTitle>
                      <CardDescription>다양한 읽기 자료로 직접 훈련</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>즉시 훈련 시작</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>다양한 주제와 난이도</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4" />
                      <span>실용적인 읽기 능력 향상</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* 훈련 모듈 선택 화면 */}
        {currentStep === 'select-module' && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* 헤더 */}
              <div className="mb-8">
                <Button variant="outline" onClick={goBack} className="mb-4">
                  뒤로 가기
                </Button>
                
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold">{getStepTitle()}</h1>
                  <p className="text-lg text-muted-foreground">{getStepDescription()}</p>
                </div>

                {/* 진행 상태 */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{getStepTitle()}</span>
                    <span className="text-sm text-muted-foreground">{getStepNumber()}</span>
                  </div>
                  <Progress value={getStepProgress()} className="h-2" />
                </div>
              </div>

              {/* 모듈 선택 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trainingModules.map((module) => (
                  <Card 
                    key={module.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group"
                    onClick={() => {
                      setCurrentStep('select-reading')
                    }}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        {module.id === 'module1' && <Brain className="h-8 w-8 text-primary" />}
                        {module.id === 'module2' && <Eye className="h-8 w-8 text-primary" />}
                        {module.id === 'module3' && <Target className="h-8 w-8 text-primary" />}
                      </div>
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {module.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{module.difficulty}</Badge>
                          <Badge variant="secondary">{module.duration}분</Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">단계별 학습</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{module.steps.length}개 단계</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 학습용 리딩 선택 화면 */}
        {currentStep === 'select-reading' && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* 헤더 */}
              <div className="mb-8">
                <Button variant="outline" onClick={goBack} className="mb-4">
                  {/* <ArrowLeft className="mr-2 h-4 w-4" /> */} {/* Removed as per edit hint */}
                  뒤로 가기
                </Button>
                
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold">{getStepTitle()}</h1>
                  <p className="text-lg text-muted-foreground">{getStepDescription()}</p>
                </div>

                {/* 진행 상태 */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{getStepTitle()}</span>
                    <span className="text-sm text-muted-foreground">{getStepNumber()}</span>
                  </div>
                  <Progress value={getStepProgress()} className="h-2" />
                </div>
              </div>

              {/* 리딩 선택 */}
              <ReadingSelector onChapterSelect={handleReadingSelect} />
            </div>
          </div>
        )}

        {/* 학습용 리딩 훈련 화면 */}
        {currentStep === 'reading-training' && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* 헤더 */}
              <div className="mb-8">
                <Button variant="outline" onClick={goBack} className="mb-4">
                  뒤로 가기
                </Button>
                
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold">리딩 훈련</h1>
                  <p className="text-lg text-muted-foreground">선택한 리딩 자료로 훈련을 시작합니다</p>
                </div>

                {/* 진행 상태 */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">리딩 훈련</span>
                    <span className="text-sm text-muted-foreground">4/4</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </div>

              {/* 리딩 훈련 컴포넌트 */}
              {selectedChapter && (
                <ReadingTraining 
                  chapter={selectedChapter} 
                  onComplete={handleReadingComplete}
                  onBack={resetTraining}
                />
              )}
            </div>
          </div>
        )}

        {/* 훈련 시작 화면 */}
        {currentStep === 'training' && (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
              {/* 헤더 */}
              <div className="mb-8">
                <Button variant="outline" onClick={goBack} className="mb-4">
                  {/* <ArrowLeft className="mr-2 h-4 w-4" /> */} {/* Removed as per edit hint */}
                  뒤로 가기
                </Button>
                
                <div className="text-center space-y-4">
                  <h1 className="text-3xl font-bold">{getStepTitle()}</h1>
                  <p className="text-lg text-muted-foreground">{getStepDescription()}</p>
                </div>

                {/* 진행 상태 */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{getStepTitle()}</span>
                    <span className="text-sm text-muted-foreground">{getStepNumber()}</span>
                  </div>
                  <Progress value={getStepProgress()} className="h-2" />
                </div>
              </div>





              {/* 훈련 컴포넌트 */}
              {plan && trainingType === 'module' && (
                <div className="space-y-6">
                  {/* 선택된 리딩 자료 정보 */}
                  {selectedChapter && (
                    <Card className="max-w-2xl mx-auto">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <BookOpen className="h-5 w-5" />
                          선택된 학습 자료
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-semibold">{selectedChapter.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {selectedChapter.source} • {selectedChapter.type === 'fiction' ? '소설' : '비소설'} • {selectedChapter.difficulty}
                            </p>
                          </div>
                          <div className="bg-muted/50 p-3 rounded-lg">
                            <p className="text-sm">
                              <strong>내용 미리보기:</strong> {selectedChapter.content.substring(0, 200)}...
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <TrainingSession 
                    plan={plan} 
                    selectedModule={trainingModules[0]}
                    selectedChapter={selectedChapter}
                    onSessionComplete={handleSessionComplete}
                    onBack={resetTraining}
                  />
                </div>
              )}
              

            </div>
          </div>
        )}

        {/* 도움말 모달 */}
        <TrainingHelpModal
          open={showHelp}
          onOpenChange={setShowHelp}
          selectedHelpKey="훈련 세션"
        />
      </div>
    </div>
  )
} 