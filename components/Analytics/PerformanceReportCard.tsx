'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award,
  Download,
  Share2,
  Calendar
} from 'lucide-react';
import { PerformanceReport } from '@/lib/analytics/types';

interface PerformanceReportCardProps {
  report: PerformanceReport;
  onExport?: (format: string) => void;
  onShare?: () => void;
}

export const PerformanceReportCard: React.FC<PerformanceReportCardProps> = ({
  report,
  onExport,
  onShare
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR');
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (improvement < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return null;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'milestone':
        return <Award className="h-4 w-4 text-yellow-600" />;
      case 'pattern':
        return <Target className="h-4 w-4 text-blue-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightColor = (significance: string) => {
    switch (significance) {
      case 'high':
        return 'border-l-4 border-l-green-500 bg-green-50';
      case 'medium':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-4 border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-4 border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>성과 보고서</span>
              <Badge variant="outline">{report.period}</Badge>
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(report.startDate)} - {formatDate(report.endDate)}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onExport?.('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              내보내기
            </Button>
            <Button variant="outline" size="sm" onClick={onShare}>
              <Share2 className="h-4 w-4 mr-2" />
              공유
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* 요약 통계 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{report.summary.totalSessions}</div>
            <div className="text-sm text-gray-600">총 세션</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{report.summary.averageWpm}</div>
            <div className="text-sm text-gray-600">평균 WPM</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{report.summary.averageAccuracy}%</div>
            <div className="text-sm text-gray-600">평균 정확도</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{report.summary.totalTime}분</div>
            <div className="text-sm text-gray-600">총 학습 시간</div>
          </div>
        </div>

        {/* 개선률 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">전체 개선률</h3>
            <div className="flex items-center space-x-2">
              {getImprovementIcon(report.summary.improvement)}
              <span className={`font-bold ${report.summary.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {report.summary.improvement > 0 ? '+' : ''}{report.summary.improvement.toFixed(1)}%
              </span>
            </div>
          </div>
          <Progress value={Math.abs(report.summary.improvement)} className="h-2" />
        </div>

        {/* 목표 달성률 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">목표 달성률</h3>
            <span className="text-sm text-gray-600">
              {report.summary.goalsAchieved} / {report.summary.totalGoals}
            </span>
          </div>
          <Progress 
            value={report.summary.totalGoals > 0 ? (report.summary.goalsAchieved / report.summary.totalGoals) * 100 : 0} 
            className="h-2" 
          />
        </div>

        {/* 인사이트 */}
        {report.insights.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">주요 인사이트</h3>
            <div className="space-y-3">
              {report.insights.slice(0, 3).map((insight) => (
                <div key={insight.id} className={`p-3 rounded-lg ${getInsightColor(insight.significance)}`}>
                  <div className="flex items-start space-x-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 추천사항 */}
        {report.recommendations.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">개선 추천사항</h3>
            <div className="space-y-2">
              {report.recommendations.slice(0, 3).map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 보고서 정보 */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          보고서 생성: {formatDate(report.generatedAt)}
        </div>
      </CardContent>
    </Card>
  );
}; 