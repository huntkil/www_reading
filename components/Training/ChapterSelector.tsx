'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Clock, FileText } from 'lucide-react';
import { Chapter, Book, fetchReadingMaterials, getChaptersByBook, getChaptersByDifficulty } from '@/lib/readingMaterials';

interface ChapterSelectorProps {
  onChapterSelect: (chapter: Chapter) => void;
  selectedChapter?: Chapter;
}

export default function ChapterSelector({ onChapterSelect, selectedChapter }: ChapterSelectorProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const materials = await fetchReadingMaterials();
        setChapters(materials.chapters);
        setBooks(materials.books);
      } catch (error) {
        console.error('Failed to load reading materials:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMaterials();
  }, []);

  // Filter chapters based on search and filters
  const filteredChapters = chapters.filter(chapter => {
    let filtered = true;

    // Search filter
    if (searchQuery) {
      filtered = filtered && (
        chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chapter.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Book filter
    if (selectedBook !== 'all') {
      filtered = getChaptersByBook([chapter], selectedBook).length > 0;
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = getChaptersByDifficulty([chapter], selectedDifficulty).length > 0;
    }

    return filtered;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">읽기 자료를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="챕터 제목이나 내용으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Book Selection */}
        <div>
          <h4 className="text-sm font-medium mb-3">교재 선택</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedBook === 'all' ? 'ring-2 ring-primary border-primary' : 'border-border'
              }`}
              onClick={() => setSelectedBook('all')}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium">모든 교재</p>
                    <p className="text-xs text-muted-foreground">
                      {chapters.length}개 챕터
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {books.map((book) => (
              <Card 
                key={book.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedBook === book.id ? 'ring-2 ring-primary border-primary' : 'border-border'
                }`}
                onClick={() => setSelectedBook(selectedBook === book.id ? 'all' : book.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{book.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {book.totalChapters}개 챕터 • {book.estimatedTotalTime}분
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h4 className="text-sm font-medium mb-3">난이도 필터</h4>
          <div className="flex gap-2">
            <Button
              variant={selectedDifficulty === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty('all')}
            >
              모든 난이도
            </Button>
            <Button
              variant={selectedDifficulty === 'beginner' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty('beginner')}
            >
              초급
            </Button>
            <Button
              variant={selectedDifficulty === 'intermediate' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty('intermediate')}
            >
              중급
            </Button>
            <Button
              variant={selectedDifficulty === 'advanced' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDifficulty('advanced')}
            >
              고급
            </Button>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div>
        <h4 className="text-sm font-medium mb-3">
          챕터 목록 ({filteredChapters.length}개)
        </h4>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredChapters.map((chapter) => (
            <Card 
              key={chapter.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedChapter?.id === chapter.id ? 'ring-2 ring-primary border-primary' : 'border-border'
              }`}
              onClick={() => onChapterSelect(chapter)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-medium truncate">{chapter.title}</h5>
                      <Badge variant="outline" className="text-xs">
                        {chapter.book}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{chapter.wordCount.toLocaleString()}단어</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{chapter.estimatedReadingTime}분</span>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          chapter.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                          chapter.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {chapter.difficulty === 'beginner' ? '초급' : 
                         chapter.difficulty === 'intermediate' ? '중급' : '고급'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredChapters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>조건에 맞는 챕터가 없습니다.</p>
            <p className="text-sm">검색어나 필터를 변경해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
} 