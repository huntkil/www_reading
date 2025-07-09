'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, FileText, Book, Newspaper, HelpCircle } from "lucide-react"
import { aliceChapters, dailyEssays, ReadingChapter } from '@/lib/readingMaterials'
import TrainingHelpModal from './TrainingHelpModal'
import { useState } from 'react'

interface ReadingSelectorProps {
  onChapterSelect: (chapter: ReadingChapter) => void
}

export function ReadingSelector({ onChapterSelect }: ReadingSelectorProps) {
  const [showHelpModal, setShowHelpModal] = useState(false)

  const handleChapterSelect = (chapter: ReadingChapter) => {
    onChapterSelect(chapter)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '초급': return 'bg-green-100 text-green-800'
      case '중급': return 'bg-yellow-100 text-yellow-800'
      case '고급': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    return type === 'fiction' ? <Book className="h-4 w-4" /> : <Newspaper className="h-4 w-4" />
  }

  const renderChapterCard = (chapter: ReadingChapter) => {
    return (
      <Card 
        key={chapter.id} 
        className="cursor-pointer transition-all hover:shadow-lg border border-gray-200 dark:border-gray-700"
        onClick={() => handleChapterSelect(chapter)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getTypeIcon(chapter.type)}
              <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{chapter.title}</CardTitle>
            </div>
            <Badge className={getDifficultyColor(chapter.difficulty)}>
              {chapter.difficulty}
            </Badge>
          </div>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            {chapter.source}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="mb-3 min-h-[4rem]">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {chapter.content.length > 150 
                ? `${chapter.content.substring(0, 150)}...` 
                : chapter.content
              }
            </p>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{chapter.estimatedTime}분</span>
            </div>
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4" />
              <span>{Math.ceil(chapter.content.length / 100)}자</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">학습용 리딩 선택</h2>
        <p className="text-muted-foreground">
          다양한 주제와 난이도의 읽기 자료를 선택하여 훈련하세요
        </p>
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHelpModal(true)}
            className="flex items-center space-x-2"
          >
            <HelpCircle className="h-4 w-4" />
            <span>읽기 자료 선택 가이드</span>
          </Button>
        </div>
      </div>

      {/* 읽기 자료 선택 가이드 */}
      <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
        <HelpCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>📚 선택 팁:</strong> 처음이시라면 초급 난이도의 짧은 에세이부터 시작하세요. 
          소설은 이야기 흐름을 따라가며 읽는 연습에, 에세이는 논리적 사고와 이해력 향상에 도움이 됩니다.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="fiction" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="fiction" className="flex items-center space-x-2">
            <Book className="h-4 w-4" />
            <span>소설</span>
          </TabsTrigger>
          <TabsTrigger value="non-fiction" className="flex items-center space-x-2">
            <Newspaper className="h-4 w-4" />
            <span>에세이</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fiction" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aliceChapters.map(renderChapterCard)}
          </div>
        </TabsContent>

        <TabsContent value="non-fiction" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyEssays.map(renderChapterCard)}
          </div>
        </TabsContent>
      </Tabs>

      {/* 도움말 모달 */}
      <TrainingHelpModal
        open={showHelpModal}
        onOpenChange={setShowHelpModal}
        selectedHelpKey="적응적 속도 훈련"
      />
    </div>
  )
} 