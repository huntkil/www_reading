'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Brain, Eye, Target, BookOpen, Clock, ArrowRight } from "lucide-react"

interface Module {
  id: string
  title: string
  description: string
  difficulty: string
  duration: number
  icon: any
  steps: any[]
}

interface ModuleSelectorProps {
  modules: Module[]
  onModuleSelect: (module: Module) => void
}

export function ModuleSelector({ modules, onModuleSelect }: ModuleSelectorProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  const handleModuleSelect = (module: Module) => {
    setSelectedModule(module)
  }

  const startModule = () => {
    if (selectedModule) {
      onModuleSelect(selectedModule)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급': return 'bg-green-100 text-green-800'
      case '중급': return 'bg-yellow-100 text-yellow-800'
      case '고급': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">훈련 모듈 선택</h2>
        <p className="text-muted-foreground">
          원하는 훈련 모듈을 선택하여 단계별로 학습하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => {
          const Icon = module.icon
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
                  <Badge className={getDifficultyColor(module.difficulty)}>
                    {module.difficulty}
                  </Badge>
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
                    <BookOpen className="h-4 w-4" />
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
    </div>
  )
} 