'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, FileText, ArrowRight, Book, Newspaper } from "lucide-react"
import { aliceChapters, dailyEssays, ReadingChapter } from '@/lib/readingMaterials'

interface ReadingSelectorProps {
  onChapterSelect: (chapter: ReadingChapter) => void
}

export function ReadingSelector({ onChapterSelect }: ReadingSelectorProps) {
  const [selectedChapter, setSelectedChapter] = useState<ReadingChapter | null>(null)

  const handleChapterSelect = (chapter: ReadingChapter) => {
    setSelectedChapter(chapter)
  }

  const startReading = () => {
    if (selectedChapter) {
      onChapterSelect(selectedChapter)
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

  const getTypeIcon = (type: string) => {
    return type === 'fiction' ? <Book className="h-4 w-4" /> : <Newspaper className="h-4 w-4" />
  }

  const renderChapterCard = (chapter: ReadingChapter) => {
    const isSelected = selectedChapter?.id === chapter.id
    
    return (
      <Card 
        key={chapter.id} 
        className={`cursor-pointer transition-all hover:shadow-lg ${
          isSelected ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => handleChapterSelect(chapter)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getTypeIcon(chapter.type)}
              <CardTitle className="text-lg">{chapter.title}</CardTitle>
            </div>
            <Badge className={getDifficultyColor(chapter.difficulty)}>
              {chapter.difficulty}
            </Badge>
          </div>
          <CardDescription className="text-sm">
            {chapter.source}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {chapter.content}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
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
      </div>

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

      {selectedChapter && (
        <div className="flex justify-center">
          <Button 
            onClick={startReading}
            size="lg"
            className="px-8"
          >
            <ArrowRight className="mr-2 h-4 w-4" />
            {selectedChapter.title} 읽기 시작
          </Button>
        </div>
      )}
    </div>
  )
} 