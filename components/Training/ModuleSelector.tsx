'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Clock, ArrowRight, HelpCircle, Brain, Eye, Target } from "lucide-react"
import TrainingHelpModal from './TrainingHelpModal'

interface Module {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  icon: React.ComponentType
  steps: Array<{
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
  }>
}

interface ModuleSelectorProps {
  modules: Module[]
  onModuleSelect: (module: Module) => void
}

export function ModuleSelector({ modules, onModuleSelect }: ModuleSelectorProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [helpKey, setHelpKey] = useState('')

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module)
  }

  const startModule = () => {
    if (selectedModule) {
      onModuleSelect(selectedModule)
    }
  }

  const showModuleHelp = (module: Module) => {
    // 모듈별 도움말 키 설정
    if (module.title.includes('기초')) {
      setHelpKey('훈련 세션')
    } else if (module.title.includes('시각적')) {
      setHelpKey('의미 단위 읽기')
    } else if (module.title.includes('고급')) {
      setHelpKey('적응적 속도 훈련')
    } else {
      setHelpKey('훈련 세션')
    }
    setShowHelpModal(true)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급': return 'bg-green-100 text-green-800'
      case '중급': return 'bg-yellow-100 text-yellow-800'
      case '고급': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getModuleIcon = (module: Module) => {
    if (module.title.includes('기초')) return Brain
    if (module.title.includes('시각적')) return Eye
    if (module.title.includes('고급')) return Target
    return FileText
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">훈련 모듈 선택</h2>
        <p className="text-muted-foreground">
          원하는 훈련 모듈을 선택하여 단계별로 학습하세요
        </p>
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setHelpKey('훈련 세션')
              setShowHelpModal(true)
            }}
            className="flex items-center space-x-2"
          >
            <HelpCircle className="h-4 w-4" />
            <span>훈련 방법 가이드</span>
          </Button>
        </div>
      </div>

      {/* 모듈 선택 가이드 */}
      <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <HelpCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-200">
          <strong>💡 선택 가이드:</strong> 처음이시라면 &apos;기초 속발음 제어 훈련&apos;부터 시작하세요. 
          각 모듈은 단계별로 구성되어 있어 체계적으로 학습할 수 있습니다.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => {
          const Icon = getModuleIcon(module)
          const isSelected = selectedModule?.id === module.id
          
          return (
            <Card 
              key={module.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => handleModuleSelect(module)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(module.difficulty)}>
                      {module.difficulty}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        showModuleHelp(module)
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <HelpCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{module.duration}분</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>{module.steps.length}단계</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedModule && (
        <div className="flex justify-center">
          <Button 
            onClick={startModule}
            size="lg"
            className="px-8"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            {selectedModule.title} 시작하기
          </Button>
        </div>
      )}

      {/* 도움말 모달 */}
      <TrainingHelpModal
        open={showHelpModal}
        onOpenChange={setShowHelpModal}
        selectedHelpKey={helpKey}
      />
    </div>
  )
} 