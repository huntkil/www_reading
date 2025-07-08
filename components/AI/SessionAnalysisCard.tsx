import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { SessionAnalysis } from '@/lib/ai/types';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Lightbulb, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  Star,
  MessageSquare
} from 'lucide-react';

interface SessionAnalysisCardProps {
  analysis: SessionAnalysis;
  onViewDetails?: () => void;
  onApplyRecommendations?: () => void;
}

export const SessionAnalysisCard: React.FC<SessionAnalysisCardProps> = ({
  analysis,
  onViewDetails,
  onApplyRecommendations
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getEmotionalStateIcon = (state: string) => {
    switch (state) {
      case 'positive':
        return <Star className="h-4 w-4 text-green-600" />;
      case 'negative':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEmotionalStateText = (state: string) => {
    switch (state) {
      case 'positive':
        return '긍정적';
      case 'negative':
        return '부정적';
      default:
        return '중립적';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <CardTitle>AI 세션 분석</CardTitle>
          </div>
          <Badge className={getScoreBadgeColor(analysis.analysis.overallScore)}>
            {analysis.analysis.overallScore}점
          </Badge>
        </div>
        <CardDescription>
          {new Date(analysis.timestamp).toLocaleString('ko-KR')}에 생성된 분석 결과
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 전체 점수 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">전체 성과 점수</span>
            <span className={`text-lg font-bold ${getScoreColor(analysis.analysis.overallScore)}`}>
              {analysis.analysis.overallScore}점
            </span>
          </div>
          <Progress value={analysis.analysis.overallScore} className="h-2" />
        </div>

        {/* 감정 상태 */}
        <div className="flex items-center space-x-2">
          {getEmotionalStateIcon(analysis.analysis.emotionalState)}
          <span className="text-sm font-medium">감정 상태:</span>
          <Badge variant="outline">
            {getEmotionalStateText(analysis.analysis.emotionalState)}
          </Badge>
        </div>

        {/* 강점 */}
        {analysis.analysis.strengths.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">강점</span>
            </div>
            <div className="space-y-1">
              {analysis.analysis.strengths.map((strength, index) => (
                <div key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                  {strength}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 개선점 */}
        {analysis.analysis.weaknesses.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium">개선점</span>
            </div>
            <div className="space-y-1">
              {analysis.analysis.weaknesses.map((weakness, index) => (
                <div key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                  {weakness}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 집중 영역 */}
        {analysis.analysis.focusAreas.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">집중 영역</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {analysis.analysis.focusAreas.map((area, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {area}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* AI 피드백 */}
        {analysis.aiFeedback && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium">AI 피드백</span>
            </div>
            <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
              {analysis.aiFeedback}
            </div>
          </div>
        )}

        {/* 개선 팁 */}
        {analysis.improvementTips.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">개선 팁</span>
            </div>
            <div className="space-y-1">
              {analysis.improvementTips.map((tip, index) => (
                <div key={index} className="text-sm text-gray-700 bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 다음 목표 */}
        {analysis.analysis.nextGoals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium">다음 목표</span>
            </div>
            <div className="space-y-1">
              {analysis.analysis.nextGoals.map((goal, index) => (
                <div key={index} className="text-sm text-indigo-700 bg-indigo-50 p-2 rounded">
                  {goal}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추천사항 */}
        {analysis.analysis.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-pink-600" />
              <span className="text-sm font-medium">추천사항</span>
            </div>
            <div className="space-y-1">
              {analysis.analysis.recommendations.map((recommendation, index) => (
                <div key={index} className="text-sm text-pink-700 bg-pink-50 p-2 rounded">
                  {recommendation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 액션 버튼들 */}
        <div className="flex space-x-2 pt-4">
          {onViewDetails && (
            <Button variant="outline" onClick={onViewDetails} className="flex-1">
              상세 보기
            </Button>
          )}
          {onApplyRecommendations && (
            <Button onClick={onApplyRecommendations} className="flex-1">
              추천사항 적용
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 