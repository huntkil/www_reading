import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ContentRecommendation } from '@/lib/ai/types';
import { 
  BookOpen, 
  Target, 
  Star, 
  Lightbulb, 
  Play,
  Bookmark,
  Share2
} from 'lucide-react';

interface RecommendationCardProps {
  recommendation: ContentRecommendation;
  onStart?: () => void;
  onSave?: () => void;
  onShare?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onStart,
  onSave,
  onShare
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <BookOpen className="h-4 w-4" />;
      case 'exercise':
        return <Target className="h-4 w-4" />;
      case 'technique':
        return <Lightbulb className="h-4 w-4" />;
      case 'goal':
        return <Star className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'text':
        return '읽기 텍스트';
      case 'exercise':
        return '연습 문제';
      case 'technique':
        return '기법 학습';
      case 'goal':
        return '목표 설정';
      default:
        return '콘텐츠';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '초급';
      case 'intermediate':
        return '중급';
      case 'advanced':
        return '고급';
      default:
        return '기본';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            {getTypeIcon(recommendation.type)}
            <div>
              <CardTitle className="text-lg">{recommendation.title}</CardTitle>
              <CardDescription className="text-sm">
                {getTypeText(recommendation.type)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getDifficultyColor(recommendation.difficulty)}>
              {getDifficultyText(recommendation.difficulty)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {recommendation.estimatedTime}분
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 설명 */}
        <p className="text-sm text-gray-600">
          {recommendation.description}
        </p>

        {/* 태그들 */}
        {recommendation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recommendation.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 추천 신뢰도 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">추천 신뢰도</span>
            <span className={`font-medium ${getConfidenceColor(recommendation.confidence)}`}>
              {Math.round(recommendation.confidence * 100)}%
            </span>
          </div>
          <Progress value={recommendation.confidence * 100} className="h-2" />
        </div>

        {/* 추천 이유 */}
        {recommendation.reasoning && (
          <div className="bg-blue-50 p-3 rounded">
            <div className="flex items-start space-x-2">
              <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">추천 이유</p>
                <p className="text-sm text-blue-700">{recommendation.reasoning}</p>
              </div>
            </div>
          </div>
        )}

        {/* 콘텐츠 미리보기 */}
        {recommendation.content && (
          <div className="bg-gray-50 p-3 rounded">
            <p className="text-sm font-medium text-gray-800 mb-2">콘텐츠 미리보기</p>
            <p className="text-sm text-gray-600 line-clamp-3">
              {recommendation.content}
            </p>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex space-x-2 pt-2">
          {onStart && (
            <Button onClick={onStart} className="flex-1">
              <Play className="h-4 w-4 mr-2" />
              시작하기
            </Button>
          )}
          {onSave && (
            <Button variant="outline" onClick={onSave}>
              <Bookmark className="h-4 w-4" />
            </Button>
          )}
          {onShare && (
            <Button variant="outline" onClick={onShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* 생성 시간 */}
        <div className="text-xs text-muted-foreground text-center">
          {new Date(recommendation.createdAt).toLocaleString('ko-KR')}에 생성됨
        </div>
      </CardContent>
    </Card>
  );
}; 