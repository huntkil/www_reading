'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Timer, CheckCircle, ArrowLeft, Target, Brain, Eye, HelpCircle, ZoomOut, ZoomIn, Play, Pause, RotateCcw } from 'lucide-react'
import { ReadingChapter } from '@/lib/readingMaterials'
import { TrainingPlan } from '@/lib/types'
import TrainingHelpModal from './TrainingHelpModal'

interface TrainingStep {
  id: string
  title: string
  type: string
  content: string
  readingText?: string
  questions?: Array<{
    question: string
    options: string[]
    correct: number
  }>
}

export interface TrainingModule {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  icon: React.ComponentType
  steps: TrainingStep[]
}

interface TrainingSessionProps {
  plan: TrainingPlan | null
  selectedModule?: TrainingModule | null
  selectedChapter?: ReadingChapter | null
  onSessionComplete: (stats: { wpm: number; accuracy: number; module: string }) => void
  onBack?: () => void
}

// 단계별 훈련 모듈 정의
const trainingModules = [
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
      },
      {
        id: 'step1_3',
        title: "허밍/카운팅 훈련",
        type: 'exercise',
        content: `
          <h3>허밍 훈련</h3>
          <p>허밍을 하면서 읽으면 내면의 목소리를 효과적으로 억제할 수 있습니다.</p>
          <p><strong>방법:</strong></p>
          <ol>
            <li>조용히 "음~" 소리를 내면서 읽기</li>
            <li>일정한 톤을 유지하며 텍스트에 집중</li>
            <li>내면의 목소리가 나타나면 허밍 강도 증가</li>
          </ol>
        `,
        readingText: "속발음 억제 훈련의 핵심은 내면의 목소리에 의존하지 않고 시각적 정보를 직접 처리하는 능력을 기르는 것입니다. 연구에 따르면, 숙련된 독자들도 여전히 속발음을 하지만 더 효율적으로 처리합니다. 키스 레이너의 연구는 안구 운동과 인지 처리 과정이 밀접하게 연결되어 있음을 보여줍니다. 독자들은 어려운 단어나 예측 불가능한 단어에서 더 오래 머무르며, 이는 자연스러운 인지 과정입니다. 따라서 목표는 속발음을 완전히 제거하는 것이 아니라, 텍스트의 종류와 목적에 따라 유연하게 관리하는 것입니다. 복잡한 개념이나 새로운 정보를 읽을 때는 속발음이 이해를 돕지만, 익숙한 내용이나 빠른 정보 검색 시에는 억제하는 것이 효율적입니다.",
        questions: [
          {
            question: "숙련된 독자들의 속발음 특징은 무엇인가요?",
            options: [
              "완전히 제거됨",
              "더 효율적으로 처리함",
              "더 강하게 나타남",
              "무작위로 발생함"
            ],
            correct: 1
          },
          {
            question: "언제 속발음을 억제하는 것이 효율적인가요?",
            options: [
              "복잡한 개념을 읽을 때",
              "새로운 정보를 읽을 때",
              "익숙한 내용이나 빠른 정보 검색 시",
              "학습 목적의 깊은 읽기 시"
            ],
            correct: 2
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
      },
      {
        id: 'step2_3',
        title: "구문 단위 청킹 훈련",
        type: 'exercise',
        content: `
          <h3>고급 청킹 연습</h3>
          <p>전체 구문이나 절을 하나의 단위로 인식하는 연습을 합니다.</p>
          <p><strong>방법:</strong></p>
          <ol>
            <li>쉼표나 마침표로 구분된 구문 단위로 읽기</li>
            <li>각 구문의 핵심 의미를 파악</li>
            <li>문맥을 통해 다음 내용 예측</li>
          </ol>
        `,
        readingText: "구문 단위 청킹은 더욱 고급 수준의 읽기 기법입니다. 이 단계에서는 쉼표나 마침표로 구분된 전체 구문을 하나의 의미 단위로 인식합니다. 예를 들어 '인지과학 연구에 따르면, 읽기 과정에서 발생하는 속발음은 뇌의 음운 고리와 밀접한 관련이 있습니다'라는 문장을 '인지과학 연구에 따르면' + '읽기 과정에서 발생하는 속발음은' + '뇌의 음운 고리와 밀접한 관련이 있습니다'로 나누어 처리하는 것입니다. 이 기법을 통해 읽기 속도를 크게 향상시킬 수 있으며, 동시에 이해도도 유지할 수 있습니다. 연구에 따르면 구문 단위 청킹을 마스터한 독자들은 분당 400-600단어의 속도로 읽을 수 있습니다.",
        questions: [
          {
            question: "구문 단위 청킹의 특징은 무엇인가요?",
            options: [
              "개별 단어를 정확히 발음하기",
              "쉼표나 마침표로 구분된 구문을 하나의 단위로 처리",
              "모든 문장을 외우기",
              "읽기 속도만 빠르게 하기"
            ],
            correct: 1
          },
          {
            question: "구문 단위 청킹을 마스터한 독자들의 읽기 속도는?",
            options: [
              "200-300 WPM",
              "300-400 WPM",
              "400-600 WPM",
              "600-800 WPM"
            ],
            correct: 2
          }
        ]
      }
    ]
  },
  {
    id: 'module3',
    title: "스킬드 리딩 및 스캔 훈련",
    description: "특정 정보를 빠르게 찾아내고 핵심 내용을 파악하는 능력을 향상시킵니다.",
    difficulty: "고급",
    duration: 25,
    icon: Target,
    steps: [
      {
        id: 'step3_1',
        title: "스킬드 리딩 이해하기",
        type: 'lesson',
        content: `
          <h3>스킬드 리딩이란 무엇인가요?</h3>
          <p>스킬드 리딩은 특정 정보나 키워드를 찾기 위해 텍스트를 빠르게 훑어보는 기법입니다.</p>
          
          <h3>스킬드 리딩의 목적</h3>
          <ul>
            <li><strong>정보 검색:</strong> 특정 키워드나 개념 찾기</li>
            <li><strong>개요 파악:</strong> 문서의 전체 구조 이해</li>
            <li><strong>핵심 추출:</strong> 중요한 정보만 선별</li>
          </ul>
          
          <h3>스킬드 리딩 기법</h3>
          <ol>
            <li>제목과 부제목 확인</li>
            <li>첫 문장과 마지막 문장 읽기</li>
            <li>키워드 하이라이트</li>
            <li>숫자와 날짜 찾기</li>
          </ol>
        `
      },
      {
        id: 'step3_2',
        title: "키워드 스캔 훈련",
        type: 'exercise',
        content: `
          <h3>키워드 찾기 연습</h3>
          <p>주어진 키워드를 텍스트에서 빠르게 찾아내는 연습을 합니다.</p>
          <p><strong>방법:</strong></p>
          <ol>
            <li>키워드를 머릿속에 명확히 기억</li>
            <li>텍스트를 Z자 패턴으로 스캔</li>
            <li>키워드가 포함된 문장 발견 시 정지</li>
            <li>해당 문장의 맥락 파악</li>
          </ol>
        `,
        readingText: "스킬드 리딩은 현대 정보 사회에서 필수적인 읽기 기법입니다. 인터넷에서 정보를 검색할 때, 문서에서 특정 내용을 찾을 때, 또는 시험에서 답을 찾을 때 매우 유용합니다. 스킬드 리딩의 핵심은 전체 텍스트를 읽지 않고도 원하는 정보를 빠르게 찾아내는 것입니다. 이를 위해서는 키워드를 명확히 파악하고, 텍스트의 구조를 이해하며, 효율적인 스캔 패턴을 사용해야 합니다. 연구에 따르면 스킬드 리딩을 훈련받은 사람들은 일반 독자보다 3-5배 빠르게 정보를 찾을 수 있습니다. 또한 이 기법은 읽기 효율성을 크게 향상시키고, 정보 과부하 상황에서도 효과적으로 대응할 수 있게 해줍니다.",
        questions: [
          {
            question: "스킬드 리딩의 주요 목적은 무엇인가요?",
            options: [
              "전체 텍스트를 정확히 읽기",
              "특정 정보를 빠르게 찾아내기",
              "모든 단어를 외우기",
              "읽기 속도만 빠르게 하기"
            ],
            correct: 1
          },
          {
            question: "스킬드 리딩을 훈련받은 사람들의 정보 검색 속도는?",
            options: [
              "일반 독자와 비슷함",
              "일반 독자보다 2배 빠름",
              "일반 독자보다 3-5배 빠름",
              "일반 독자보다 10배 빠름"
            ],
            correct: 2
          }
        ]
      },
      {
        id: 'step3_3',
        title: "개요 파악 훈련",
        type: 'exercise',
        content: `
          <h3>문서 구조 파악 연습</h3>
          <p>문서의 전체적인 구조와 핵심 내용을 빠르게 파악하는 연습을 합니다.</p>
          <p><strong>방법:</strong></p>
          <ol>
            <li>제목과 부제목을 순서대로 확인</li>
            <li>각 섹션의 첫 문장과 마지막 문장 읽기</li>
            <li>그림, 표, 차트 등 시각 자료 확인</li>
            <li>전체적인 논리 흐름 파악</li>
          </ol>
        `,
        readingText: "문서의 개요를 파악하는 것은 효율적인 읽기의 첫 번째 단계입니다. 긴 문서나 책을 읽기 전에 전체적인 구조를 이해하면 읽기 효율성이 크게 향상됩니다. 개요 파악의 핵심은 문서의 논리적 구조를 이해하는 것입니다. 대부분의 문서는 도입부, 본론, 결론의 구조를 가지고 있으며, 각 섹션은 특정 목적을 가지고 있습니다. 도입부에서는 주제와 목적을 제시하고, 본론에서는 주요 내용을 전개하며, 결론에서는 핵심 요약과 결론을 제시합니다. 이 구조를 파악하면 어떤 부분에 집중해서 읽어야 할지, 어떤 부분은 건너뛸 수 있는지 판단할 수 있습니다. 또한 개요 파악을 통해 문서의 전체적인 맥락을 이해할 수 있어, 세부 내용을 읽을 때 더 깊은 이해가 가능합니다.",
        questions: [
          {
            question: "문서의 기본 구조는 무엇인가요?",
            options: [
              "제목, 본문, 참고문헌",
              "도입부, 본론, 결론",
              "서론, 중론, 종론",
              "시작, 중간, 끝"
            ],
            correct: 1
          },
          {
            question: "개요 파악의 주요 목적은 무엇인가요?",
            options: [
              "모든 내용을 정확히 읽기",
              "문서의 논리적 구조 이해하기",
              "모든 단어를 외우기",
              "읽기 속도만 빠르게 하기"
            ],
            correct: 1
          }
        ]
      }
    ]
  }
];

export function TrainingSession({ 
  selectedModule, 
  selectedChapter, 
  onSessionComplete, 
  onBack 
}: TrainingSessionProps) {
  const [currentModuleIndex] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [sessionState, setSessionState] = useState<'lesson' | 'exercise' | 'reading' | 'comprehension' | 'complete'>('lesson')
  const [timeLeft, setTimeLeft] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [readingStartTime, setReadingStartTime] = useState<number | null>(null)
  const [readingEndTime, setReadingEndTime] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | string)[]>([])
  const [comprehensionScore, setComprehensionScore] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large' | 'xlarge'>('medium')

  const currentModule = selectedModule || trainingModules[currentModuleIndex]
  const currentStep = currentModule.steps[currentStepIndex]

  // 선택한 리딩 자료가 있으면 해당 내용을 사용 (reading 단계에서만)
  const readingContent = selectedChapter?.content || currentStep.readingText
  const readingQuestions = selectedChapter?.questions || currentStep.questions



  const startExercise = () => {
    console.log('=== startExercise ===')
    console.log('currentModule:', currentModule)
    console.log('currentStep:', currentStep)
    setSessionState('exercise')
    setTimeLeft(currentModule.duration * 60)
    setIsPaused(false)
  }

  const startReading = () => {
    console.log('=== startReading 버튼 클릭 ===')
    console.log('현재 상태:', sessionState)
    console.log('읽기 시작 시간 설정:', new Date().toISOString())
    setSessionState('reading')
    setReadingStartTime(Date.now())
  }

  const finishReading = () => {
    console.log('=== finishReading 버튼 클릭 ===')
    console.log('읽기 종료 시간 설정:', new Date().toISOString())
    console.log('이해도 퀴즈 단계로 이동')
    setReadingEndTime(Date.now())
    setSessionState('comprehension')
    setAnswers([])
  }

  const handleAnswerChange = (index: number, value: number) => {
    console.log('=== 답변 변경 ===')
    console.log('문제 번호:', index + 1)
    console.log('선택한 답변:', value)
    console.log('기존 답변들:', answers)
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const calculateComprehensionScore = () => {
    if (!readingQuestions) return 0
    
    let correct = 0
    readingQuestions.forEach((question, index) => {
      if (answers[index] === question.correct) {
        correct++
      }
    })
    
    return Math.round((correct / readingQuestions.length) * 100)
  }

  const submitComprehension = () => {
    console.log('=== 이해도 퀴즈 제출 버튼 클릭 ===')
    console.log('선택한 답변들:', answers)
    
    const score = calculateComprehensionScore()
    console.log('계산된 이해도 점수:', score + '%')
    setComprehensionScore(score)
    
    // WPM 계산 - 선택한 리딩 자료 또는 기본 텍스트 사용
    if (readingStartTime && readingEndTime && readingContent) {
      const readingTime = (readingEndTime - readingStartTime) / 1000 / 60 // 분 단위
      const wordCount = readingContent.split(/\s+/).length
      const calculatedWpm = Math.round(wordCount / readingTime)
      console.log('계산된 WPM:', calculatedWpm)
      console.log('읽기 시간:', readingTime.toFixed(2) + '분')
      console.log('단어 수:', wordCount)
      setWpm(calculatedWpm)
    }
    
    setSessionState('complete')
    console.log('훈련 완료 상태로 변경')
    
    // 피드백 메시지 생성
    if (score >= 80) {
      setFeedbackMessage({ type: 'success', message: '훌륭합니다! 높은 이해도를 보여주셨습니다.' })
    } else if (score >= 60) {
      setFeedbackMessage({ type: 'success', message: '좋습니다! 이해도가 양호합니다. 더 연습하면 더 좋아질 것입니다.' })
    } else {
      setFeedbackMessage({ type: 'error', message: '이해도가 낮습니다. 텍스트를 다시 천천히 읽어보세요.' })
    }
  }

  const nextStep = () => {
    console.log('=== 다음 단계 버튼 클릭 ===')
    console.log('현재 단계 인덱스:', currentStepIndex)
    console.log('전체 단계 수:', currentModule.steps.length)
    
    if (currentStepIndex < currentModule.steps.length - 1) {
      console.log('다음 단계로 이동:', currentStepIndex + 1)
      setCurrentStepIndex(currentStepIndex + 1)
      setSessionState('lesson')
      setAnswers([])
      setComprehensionScore(0)
      setWpm(0)
      setFeedbackMessage(null)
    } else {
      console.log('모든 단계 완료, 세션 종료')
      handleSessionComplete()
    }
  }

  const handleSessionComplete = () => {
    console.log('=== 세션 완료 ===')
    console.log('최종 WPM:', wpm)
    console.log('최종 이해도:', comprehensionScore + '%')
    console.log('완료한 모듈:', currentModule.title)
    
    onSessionComplete({
      wpm,
      accuracy: comprehensionScore,
      module: currentModule.title
    })
  }

  // 타이머 효과
  useEffect(() => {
    if (timeLeft > 0 && sessionState === 'exercise' && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && sessionState === 'exercise') {
      startReading();
    }
  }, [timeLeft, sessionState, isPaused]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const togglePause = () => {
    console.log('=== 일시정지/재개 버튼 클릭 ===')
    console.log('현재 일시정지 상태:', isPaused)
    console.log('새로운 일시정지 상태:', !isPaused)
    setIsPaused(!isPaused);
  };

  const resetExercise = () => {
    console.log('=== 연습 재시작 버튼 클릭 ===')
    console.log('타이머 초기화:', currentModule.duration * 60 + '초')
    console.log('일시정지 해제')
    setTimeLeft(currentModule.duration * 60);
    setIsPaused(false);
  };

  const increaseTextSize = () => {
    console.log('=== 텍스트 크기 증가 버튼 클릭 ===')
    console.log('현재 텍스트 크기:', textSize)
    if (textSize === 'small') {
      console.log('텍스트 크기를 medium으로 변경')
      setTextSize('medium');
    } else if (textSize === 'medium') {
      console.log('텍스트 크기를 large로 변경')
      setTextSize('large');
    } else if (textSize === 'large') {
      console.log('텍스트 크기를 xlarge로 변경')
      setTextSize('xlarge');
    }
  };

  const decreaseTextSize = () => {
    console.log('=== 텍스트 크기 감소 버튼 클릭 ===')
    console.log('현재 텍스트 크기:', textSize)
    
    if (textSize === 'xlarge') {
      console.log('텍스트 크기를 large로 변경')
      setTextSize('large');
    } else if (textSize === 'large') {
      console.log('텍스트 크기를 medium으로 변경')
      setTextSize('medium');
    } else if (textSize === 'medium') {
      console.log('텍스트 크기를 small로 변경')
      setTextSize('small');
    }
  };

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'small': return 'text-xs';
      case 'medium': return 'text-sm';
      case 'large': return 'text-base';
      case 'xlarge': return 'text-2xl';
      default: return 'text-sm';
    }
  };

  if (sessionState === 'complete') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                단계 완료!
              </CardTitle>
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="h-8 w-8 p-0"
                  title="훈련 종료"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">읽기 속도</p>
                  <p className="text-2xl font-bold">{wpm} WPM</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">이해도</p>
                  <p className="text-2xl font-bold">{comprehensionScore}%</p>
                </div>
              </div>
              {feedbackMessage && (
                <Alert variant={feedbackMessage.type === 'error' ? 'destructive' : 'default'}>
                  <Timer className="h-4 w-4" />
                  <AlertDescription>{feedbackMessage.message}</AlertDescription>
                </Alert>
              )}
              <div className="flex gap-2">
                {onBack && (
                  <Button variant="outline" onClick={onBack} className="flex-1">
                    훈련 종료
                  </Button>
                )}
                <Button onClick={nextStep} className="flex-1">
                  {currentStepIndex < currentModule.steps.length - 1 ? '다음 단계' : '모듈 완료'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <currentModule.icon className="h-5 w-5" />
                {currentModule.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {currentStep.title} - {currentModule.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{currentModule.difficulty}</Badge>
                <Badge variant="secondary">{currentModule.duration}분</Badge>
                <Badge variant="outline">단계 {currentStepIndex + 1}/{currentModule.steps.length}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowHelpModal(true)}
                className="h-8 w-8 p-0"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>
              {onBack && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="h-8 w-8 p-0"
                  title="훈련 종료"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {sessionState === 'lesson' && (
            <div className="space-y-6">
              {/* 선택된 리딩 자료 정보 표시 */}
              {selectedChapter && (
                <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2 text-primary">📚 선택된 학습 자료</h4>
                  <p className="text-sm font-medium">
                    {selectedChapter.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    출처: {selectedChapter.source} | 유형: {selectedChapter.type === 'fiction' ? '소설' : '비소설'} | 난이도: {selectedChapter.difficulty}
                  </p>
                </div>
              )}
              
              {/* 선택한 리딩 자료의 내용 표시 */}
              {selectedChapter && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">읽을 텍스트:</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseTextSize}
                        disabled={textSize === 'small'}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground min-w-[40px] text-center">
                        {textSize === 'small' ? '작게' : textSize === 'medium' ? '보통' : textSize === 'large' ? '크게' : '아주 크게'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseTextSize}
                        disabled={textSize === 'xlarge'}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className={`${getTextSizeClass()} leading-relaxed`}>
                    {selectedChapter.content}
                  </div>
                </div>
              )}
              
              <Button onClick={startExercise} className="w-full">
                <Play className="h-4 w-4 mr-2" />
                훈련 시작
              </Button>
            </div>
          )}

          {sessionState === 'exercise' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePause}
                  >
                    {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    {isPaused ? '계속' : '일시정지'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetExercise}
                  >
                    <RotateCcw className="h-4 w-4" />
                    재시작
                  </Button>
                </div>
                <div className="text-2xl font-mono">
                  {formatTime(timeLeft)}
                </div>
              </div>
              
              {/* 선택한 리딩 자료의 내용 표시 */}
              {selectedChapter && (
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">읽을 텍스트:</h3>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseTextSize}
                        disabled={textSize === 'small'}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <span className="text-xs text-muted-foreground min-w-[40px] text-center">
                        {textSize === 'small' ? '작게' : textSize === 'medium' ? '보통' : textSize === 'large' ? '크게' : '아주 크게'}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseTextSize}
                        disabled={textSize === 'xlarge'}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className={`${getTextSizeClass()} leading-relaxed`}>
                    {selectedChapter.content}
                  </div>
                </div>
              )}
              
              <Progress value={(currentModule.duration * 60 - timeLeft) / (currentModule.duration * 60) * 100} />
            </div>
          )}

          {sessionState === 'reading' && (
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">
                  {selectedChapter ? '선택된 리딩 자료:' : '읽을 텍스트:'}
                </h3>
                {selectedChapter && (
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                    <h4 className="font-medium text-primary">{selectedChapter.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {selectedChapter.source} • {selectedChapter.type === 'fiction' ? '소설' : '비소설'} • {selectedChapter.difficulty}
                    </p>
                  </div>
                )}
                <div className="text-sm leading-relaxed">
                  {selectedChapter ? selectedChapter.content : currentStep.readingText}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  텍스트를 읽은 후 아래 버튼을 클릭하세요.
                </p>
                <Button onClick={finishReading}>
                  읽기 완료
                </Button>
              </div>
            </div>
          )}

          {sessionState === 'comprehension' && (
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-4">이해도 확인 질문:</h3>
                {readingQuestions?.map((question, index) => (
                  <div key={index} className="mb-6">
                    <Label className="text-sm font-medium">
                      {index + 1}. {question.question}
                    </Label>
                    <RadioGroup
                      value={answers[index]?.toString() || ''}
                      onValueChange={(value) => handleAnswerChange(index, parseInt(value))}
                      className="mt-2"
                    >
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={optionIndex.toString()} id={`q${index}-${optionIndex}`} />
                          <Label htmlFor={`q${index}-${optionIndex}`} className="text-sm">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={submitComprehension} 
                className="w-full"
                disabled={answers.length !== readingQuestions?.length}
              >
                답변 제출
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TrainingHelpModal 
        isOpen={showHelpModal} 
        onClose={() => setShowHelpModal(false)}
        exerciseName={currentStep.title}
        sessionType="custom"
      />
    </div>
  );
} 