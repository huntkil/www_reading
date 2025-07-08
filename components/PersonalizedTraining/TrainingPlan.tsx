import React, { useState } from 'react';
import { 
  Calendar, 
  Target, 
  Clock, 
  CheckCircle, 
  Circle,
  TrendingUp,
  BookOpen,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import type { TrainingPlan, Exercise } from './types';

interface TrainingPlanProps {
  plan: TrainingPlan;
  currentWeek?: number;
  onWeekComplete?: (week: number) => void;
  className?: string;
}

export function TrainingPlan({ 
  plan, 
  currentWeek = 1, 
  onWeekComplete,
  className = '' 
}: TrainingPlanProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(currentWeek);

  const toggleWeek = (week: number) => {
    setExpandedWeek(expandedWeek === week ? null : week);
  };

  const getWeekStatus = (week: number) => {
    if (week < currentWeek) return 'completed';
    if (week === currentWeek) return 'current';
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Circle className="h-5 w-5 text-blue-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-300" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'current':
        return '진행 중';
      default:
        return '예정';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 계획 헤더 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            {plan.title}
          </CardTitle>
          <p className="text-muted-foreground">{plan.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">기간: {plan.duration}주</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">난이도: {plan.difficulty}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">예상 개선: {plan.estimatedImprovement}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주간 목표들 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          주간 목표
        </h3>
        
        {plan.weeklyGoals?.map((weekGoal) => {
          const status = getWeekStatus(weekGoal.week);
          const isExpanded = expandedWeek === weekGoal.week;
          
          return (
            <Card key={weekGoal.week} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleWeek(weekGoal.week)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <div>
                      <CardTitle className="text-lg">
                        {weekGoal.week}주차: {weekGoal.focus}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        목표: {weekGoal.targetWPM} WPM, {weekGoal.targetAccuracy}% 정확도
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-2 py-1 rounded ${
                      status === 'completed' ? 'bg-green-100 text-green-800' :
                      status === 'current' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(status)}
                    </span>
                    <Button variant="ghost" size="sm">
                      {isExpanded ? '접기' : '펼치기'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {isExpanded && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* 목표 진행률 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>목표 진행률</span>
                        <span>0%</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                    
                    {/* 연습 목록 */}
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        이번 주 연습 목록
                      </h4>
                      <div className="space-y-3">
                        {weekGoal.exercises.map((exercise) => (
                          <ExerciseCard key={exercise.id} exercise={exercise} />
                        ))}
                      </div>
                    </div>
                    
                    {/* 완료 버튼 */}
                    {status === 'current' && onWeekComplete && (
                      <div className="flex justify-end pt-4 border-t">
                        <Button 
                          onClick={() => onWeekComplete(weekGoal.week)}
                          className="flex items-center gap-2"
                        >
                          <Award className="h-4 w-4" />
                          주차 완료
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
}

function ExerciseCard({ exercise }: ExerciseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h5 className="font-medium">{exercise.title}</h5>
          <p className="text-sm text-muted-foreground mt-1">
            {exercise.description}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(exercise.difficulty)}`}>
          {exercise.difficulty}
        </span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {exercise.duration}분
        </span>
        <span className="flex items-center gap-1">
          <Target className="h-3 w-3" />
          {exercise.technique}
        </span>
      </div>
      
      {exercise.materials && exercise.materials.length > 0 && (
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">준비물:</span> {exercise.materials.join(', ')}
        </div>
      )}
    </div>
  );
} 