import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { PersonalizedPlan, PersonalizedExercise } from '@/lib/ai/types';
import { 
  Calendar, 
  Target, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Play,
  CheckCircle,
  Circle,
  TrendingUp,
  BookOpen,
  Zap,
  Eye
} from 'lucide-react';

interface PersonalizedPlanCardProps {
  plan: PersonalizedPlan;
  onStartExercise?: (exercise: PersonalizedExercise) => void;
  onCompleteExercise?: (exerciseId: string) => void;
  onEditPlan?: () => void;
  onDeletePlan?: () => void;
}

export const PersonalizedPlanCard: React.FC<PersonalizedPlanCardProps> = ({
  plan,
  onStartExercise,
  onCompleteExercise,
  onEditPlan,
  onDeletePlan
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const handleCompleteExercise = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
    onCompleteExercise?.(exerciseId);
  };

  const getExerciseIcon = (type: string) => {
    switch (type) {
      case 'reading':
        return <BookOpen className="h-4 w-4" />;
      case 'breathing':
        return <Zap className="h-4 w-4" />;
      case 'focus':
        return <Target className="h-4 w-4" />;
      case 'speed':
        return <TrendingUp className="h-4 w-4" />;
      case 'comprehension':
        return <Eye className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
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

  const totalExercises = plan.exercises.length;
  const completedCount = completedExercises.size;
  const progressPercentage = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  const getDayName = (day: string) => {
    const dayNames: Record<string, string> = {
      monday: '월요일',
      tuesday: '화요일',
      wednesday: '수요일',
      thursday: '목요일',
      friday: '금요일',
      saturday: '토요일',
      sunday: '일요일'
    };
    return dayNames[day] || day;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <div>
              <CardTitle className="text-lg">{plan.title}</CardTitle>
              <CardDescription>
                {plan.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {plan.duration}일
            </Badge>
            <Badge variant="secondary">
              {completedCount}/{totalExercises} 완료
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 진행률 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>전체 진행률</span>
            <span className="font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* 목표 */}
        {plan.goals.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">목표</span>
            </div>
            <div className="space-y-1">
              {plan.goals.map((goal, index) => (
                <div key={index} className="text-sm text-gray-700 bg-blue-50 p-2 rounded">
                  {goal}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 운동 목록 */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-sm font-medium">운동 목록 ({totalExercises}개)</span>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {plan.exercises.map((exercise) => (
              <div key={exercise.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getExerciseIcon(exercise.type)}
                    <div>
                      <h4 className="text-sm font-medium">{exercise.title}</h4>
                      <p className="text-xs text-gray-600">{exercise.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {getDifficultyText(exercise.difficulty)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {exercise.duration}분
                    </Badge>
                  </div>
                </div>

                {/* 지시사항 */}
                {exercise.instructions.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-gray-700">지시사항:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start space-x-1">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 예상 결과 */}
                {exercise.expectedOutcome && (
                  <div className="bg-green-50 p-2 rounded">
                    <span className="text-xs font-medium text-green-800">예상 결과:</span>
                    <p className="text-xs text-green-700 mt-1">{exercise.expectedOutcome}</p>
                  </div>
                )}

                {/* 액션 버튼들 */}
                <div className="flex items-center space-x-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => onStartExercise?.(exercise)}
                    className="flex-1"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    시작
                  </Button>
                  <Button
                    size="sm"
                    variant={completedExercises.has(exercise.id) ? "default" : "outline"}
                    onClick={() => handleCompleteExercise(exercise.id)}
                  >
                    {completedExercises.has(exercise.id) ? (
                      <CheckCircle className="h-3 w-3" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* 주간 스케줄 */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-sm font-medium">주간 스케줄</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-3">
            {Object.entries(plan.schedule).map(([day, exercises]) => (
              <div key={day} className="border rounded p-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{getDayName(day)}</span>
                  <Badge variant="outline" className="text-xs">
                    {exercises.length}개 운동
                  </Badge>
                </div>
                {exercises.length > 0 ? (
                  <div className="space-y-1">
                    {exercises.map((exerciseId: string) => {
                      const exercise = plan.exercises.find(e => e.id === exerciseId);
                      return exercise ? (
                        <div key={exerciseId} className="text-xs text-gray-600 flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{exercise.title}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">휴식일</p>
                )}
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* 액션 버튼들 */}
        <div className="flex space-x-2 pt-4">
          <Button variant="outline" onClick={onEditPlan} className="flex-1">
            계획 수정
          </Button>
          <Button variant="outline" onClick={onDeletePlan} className="flex-1">
            계획 삭제
          </Button>
        </div>

        {/* 생성 정보 */}
        <div className="text-xs text-muted-foreground text-center">
          {new Date(plan.createdAt).toLocaleDateString('ko-KR')}에 생성됨
        </div>
      </CardContent>
    </Card>
  );
}; 