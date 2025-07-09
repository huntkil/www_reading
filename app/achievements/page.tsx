'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Award, Target, TrendingUp, Loader2 } from 'lucide-react'

interface Achievement {
  id: string
  type: string
  title: string
  description: string
  icon: string | null
  unlockedAt: string
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/achievement')
        if (response.ok) {
          const data = await response.json()
          setAchievements(data.data || [])
        } else {
          setError('성취 데이터를 불러오는데 실패했습니다.')
        }
      } catch (error) {
        console.error('Failed to fetch achievements:', error)
        setError('네트워크 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchAchievements()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">성취 데이터를 불러오는 중...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-destructive mb-4">오류가 발생했습니다</p>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">성취</h1>
        <p className="text-muted-foreground">
          훈련 과정에서 달성한 성취들을 확인해보세요.
        </p>
      </div>

      {achievements.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">아직 달성한 성취가 없습니다</h3>
              <p className="text-muted-foreground mb-4">
                훈련을 시작하고 목표를 달성하면 성취를 얻을 수 있습니다.
              </p>
              <Badge variant="outline" className="text-sm">
                첫 번째 성취를 향해!
              </Badge>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {new Date(achievement.unlockedAt).toLocaleDateString('ko-KR')}
                  </Badge>
                </div>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>달성 완료</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 성취 통계 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">성취 통계</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                총 성취
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{achievements.length}</div>
              <p className="text-sm text-muted-foreground">달성한 성취 수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                달성률
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {achievements.length > 0 ? Math.round((achievements.length / 10) * 100) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">전체 성취 대비</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                최근 성취
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-medium">
                {achievements.length > 0 
                  ? achievements[0].title 
                  : '아직 없음'
                }
              </div>
              <p className="text-sm text-muted-foreground">가장 최근에 달성한 성취</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 