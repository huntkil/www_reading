import React from 'react';
import { Share2, Trophy, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import type { AchievementCardProps } from './types';

export function AchievementCard({ 
  achievement, 
  onShare, 
  showProgress = true 
}: AchievementCardProps) {
  const isUnlocked = achievement.unlockedAt !== undefined;
  const progressPercentage = Math.min(100, achievement.progress);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'speed':
        return 'text-blue-600 bg-blue-100';
      case 'accuracy':
        return 'text-green-600 bg-green-100';
      case 'consistency':
        return 'text-purple-600 bg-purple-100';
      case 'streak':
        return 'text-orange-600 bg-orange-100';
      case 'milestone':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'speed':
        return '⚡';
      case 'accuracy':
        return '🎯';
      case 'consistency':
        return '📈';
      case 'streak':
        return '🔥';
      case 'milestone':
        return '🏆';
      default:
        return '🎖️';
    }
  };

  return (
    <Card className={`transition-all duration-200 ${
      isUnlocked 
        ? 'border-2 border-yellow-400 shadow-lg' 
        : 'opacity-75'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`text-2xl ${isUnlocked ? 'animate-bounce' : ''}`}>
              {achievement.icon}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {achievement.title}
                {isUnlocked && (
                  <Trophy className="h-4 w-4 text-yellow-500" />
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {achievement.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(achievement.category)}`}>
              {getCategoryIcon(achievement.category)} {achievement.category}
            </span>
            {onShare && isUnlocked && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onShare(achievement)}
                className="h-8 w-8 p-0"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {showProgress && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>진행률</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{achievement.current} {achievement.unit}</span>
              <span>{achievement.target} {achievement.unit}</span>
            </div>
          </div>
        )}
        
        {isUnlocked && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-medium">
                {achievement.unlockedAt?.toLocaleDateString()}에 달성!
              </span>
            </div>
          </div>
        )}
        
        {!isUnlocked && progressPercentage > 0 && (
          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Target className="h-4 w-4" />
              <span className="text-sm">
                목표까지 {achievement.target - achievement.current} {achievement.unit} 남음
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 