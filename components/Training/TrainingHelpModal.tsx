'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle, Lightbulb, Target, Clock, BookOpen, Brain, Eye, Zap, TrendingUp } from 'lucide-react';

interface TrainingHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseName: string;
  sessionType: 'quick' | 'speed' | 'custom';
}

interface HelpContent {
  title: string;
  description: string;
  scientificBasis: string;
  stepByStep: string[];
  tips: string[];
  expectedOutcome: string;
  duration: string;
  difficulty: string;
  icon: React.ReactNode;
}

const helpContents: { [key: string]: HelpContent } = {
  '훈련 세션': {
    title: '훈련 세션',
    description: '집중해서 텍스트를 읽고 따라 입력하는 기본 훈련입니다',
    scientificBasis: '텍스트를 따라 입력하는 훈련은 읽기와 쓰기의 동기화를 통해 집중력을 향상시키고, 내면의 목소리를 최적화하는 효과적인 방법입니다. 이는 작업 기억의 음운 고리를 효율적으로 활용하면서도 시각적 처리 능력을 향상시킵니다.',
    stepByStep: [
      '제시된 텍스트를 천천히 읽어보세요',
      '내면의 목소리를 인식하되 너무 느리게 읽지 마세요',
      '텍스트를 따라 정확하게 입력하세요',
      '오타가 나면 즉시 수정하세요',
      '일정한 속도를 유지하세요'
    ],
    tips: [
      '처음에는 천천히, 점차 속도를 높여보세요',
      '정확성을 속도보다 우선시하세요',
      '내면의 목소리를 완전히 제거하려 하지 마세요',
      '정기적으로 훈련하여 습관화하세요'
    ],
    expectedOutcome: '읽기와 쓰기의 동기화 능력이 향상되고, 집중력이 개선됩니다.',
    duration: '10-15분',
    difficulty: '초급',
    icon: <BookOpen className="h-5 w-5" />
  },
  '읽기 패턴 진단': {
    title: '읽기 패턴 진단',
    description: '현재 읽기 방식을 파악하고 개선점을 찾습니다',
    scientificBasis: '인지과학 연구에 따르면, 대부분의 성인 독자는 분당 150-250단어(WPM) 수준에서 읽기 속도가 제한됩니다. 이는 내면의 목소리(묵독)가 실제 말하기 속도와 밀접하게 연결되어 있기 때문입니다. 키스 레이너의 연구는 숙련된 독자들조차 속발음을 한다는 사실을 밝혔으며, 단지 더 빨리 속발음을 할 뿐이라고 합니다.',
    stepByStep: [
      '텍스트를 평소대로 읽어보세요',
      '내면에서 단어를 소리내어 읽는지 확인하세요',
      '읽기 속도를 측정해보세요 (분당 단어 수)',
      '이해도와 속도의 균형을 평가하세요',
      '개인별 읽기 패턴을 파악하세요'
    ],
    tips: [
      '속발음은 나쁜 습관이 아니라 자연스러운 인지 과정입니다',
      '목표는 속발음을 제거하는 것이 아니라 최적화하는 것입니다',
      '이해도를 희생하지 않는 선에서 속도를 향상시키세요'
    ],
    expectedOutcome: '현재 읽기 패턴을 정확히 파악하고, 개선이 필요한 영역을 식별할 수 있습니다.',
    duration: '5분',
    difficulty: '초급',
    icon: <Brain className="h-5 w-5" />
  },
  '페이서 훈련': {
    title: '페이서 훈련',
    description: '손가락이나 펜으로 텍스트를 따라가며 읽기 리듬을 개선합니다',
    scientificBasis: '페이서 훈련은 안구 운동을 최적화하고 회귀(regression)를 줄이는 효과적인 방법입니다. 엘리자베스 쇼터의 연구에 따르면, 독서의 병목 현상은 눈의 움직임(전체 독서 시간의 약 10% 차지)이 아니라, 단어를 인식하고 문장 구조를 분석하는 언어 처리 과정에 있습니다. 페이서는 시각적 주의를 집중시키고 일정한 리듬을 만들어줍니다.',
    stepByStep: [
      '손가락이나 펜을 준비하세요',
      '텍스트의 첫 줄부터 시작하세요',
      '손가락을 텍스트 아래에 놓고 부드럽게 따라가세요',
      '일정한 속도를 유지하세요',
      '줄바꿈 시 자연스럽게 다음 줄로 이동하세요',
      '처음에는 천천히, 점차 속도를 높여보세요'
    ],
    tips: [
      '너무 빠르게 움직이지 마세요 - 이해도를 유지하는 것이 중요합니다',
      '손가락이 텍스트를 가리지 않도록 주의하세요',
      '자연스러운 리듬을 찾을 때까지 연습하세요',
      '회귀(다시 읽기)를 최소화하는 데 집중하세요'
    ],
    expectedOutcome: '안구 운동이 최적화되고, 일정한 읽기 리듬을 형성할 수 있습니다.',
    duration: '10분',
    difficulty: '초급',
    icon: <Eye className="h-5 w-5" />
  },
  '의미 단위 읽기': {
    title: '의미 단위 읽기',
    description: '단어별 읽기에서 의미 단위 읽기로 전환합니다',
    scientificBasis: '청킹(Chunking)은 의미 단위로 여러 단어를 한 번에 처리하는 기술입니다. 이는 음운 병목 현상을 극복하는 핵심 방법으로, 처리해야 할 "소리 단위"의 수를 줄여줍니다. 배들리-히치 모델의 음운 고리 이론에 따르면, 작업 기억에서 정보를 더 효율적으로 처리할 수 있게 됩니다.',
    stepByStep: [
      '2-3단어씩 묶어서 읽어보세요',
      '의미 있는 구문 단위로 확장하세요',
      '시각적으로 단어들을 그룹화하세요',
      '각 청크의 의미를 빠르게 파악하세요',
      '점진적으로 더 큰 의미 단위로 확장하세요'
    ],
    tips: [
      '처음에는 쉬운 텍스트로 연습하세요',
      '자연스러운 의미 단위를 찾으세요',
      '각 청크의 핵심 의미에 집중하세요',
      '속도보다는 정확한 의미 파악을 우선하세요'
    ],
    expectedOutcome: '단어별 읽기에서 벗어나 의미 단위로 효율적으로 읽을 수 있게 됩니다.',
    duration: '10분',
    difficulty: '중급',
    icon: <Target className="h-5 w-5" />
  },
  '인지 병목 현상 이해': {
    title: '인지 병목 현상 이해',
    description: '읽기 속도를 제한하는 인지적 요소들을 학습합니다',
    scientificBasis: '음운 병목 현상(phonological bottleneck)은 내면의 목소리가 단어를 처리하는 속도가 실제 말하기 속도와 밀접하게 연결되어 있어 발생합니다. 대부분의 사람들에게 이는 분당 150-250 단어(WPM) 수준입니다. 이는 독서 속도가 분당 약 200-300 단어를 넘기 어렵다는 것을 의미합니다.',
    stepByStep: [
      '현재 읽기 속도를 측정하세요',
      '내면의 목소리 처리 속도를 인식하세요',
      '시각적 처리와 음운적 처리의 차이를 이해하세요',
      '병목 현상의 원인을 파악하세요',
      '개선 전략을 계획하세요'
    ],
    tips: [
      '병목 현상은 정상적인 인지 과정입니다',
      '완전한 제거보다는 최적화를 목표로 하세요',
      '텍스트 유형에 따라 다른 전략을 사용하세요',
      '이해도를 희생하지 않는 선에서 속도를 향상시키세요'
    ],
    expectedOutcome: '읽기 속도 제한의 원인을 이해하고, 효과적인 개선 전략을 세울 수 있습니다.',
    duration: '5분',
    difficulty: '중급',
    icon: <Brain className="h-5 w-5" />
  },
  '시각화 훈련': {
    title: '시각화 훈련',
    description: '텍스트를 이미지나 영상으로 변환하여 직관적 이해를 촉진합니다',
    scientificBasis: '시각화 훈련은 인지 처리 과정을 음운 고리에서 시각공간 스케치패드(visuospatial sketchpad)로 전환시킵니다. 이는 더 깊고 직관적인 의미 기반 이해를 촉진합니다. 연구에 따르면, 시각적 이미지를 활용한 학습은 기억과 이해에 더 효과적입니다.',
    stepByStep: [
      '텍스트를 읽으면서 마음속에 그림을 그려보세요',
      '장면이나 상황을 영상처럼 상상하세요',
      '캐릭터나 사물의 모습을 구체적으로 그려보세요',
      '감정이나 분위기를 색깔이나 이미지로 표현하세요',
      '이미지를 통해 의미를 직관적으로 파악하세요'
    ],
    tips: [
      '너무 복잡한 이미지를 만들려고 하지 마세요',
      '자연스럽게 떠오르는 이미지를 활용하세요',
      '시각화가 어려우면 감정이나 분위기부터 시작하세요',
      '정기적으로 연습하여 습관화하세요'
    ],
    expectedOutcome: '텍스트를 더 직관적이고 깊이 있게 이해할 수 있게 됩니다.',
    duration: '15분',
    difficulty: '중급',
    icon: <Eye className="h-5 w-5" />
  },
  '적응적 속도 훈련': {
    title: '적응적 속도 훈련',
    description: '텍스트 유형과 목적에 따라 읽기 속도를 조절합니다',
    scientificBasis: '숙련된 독자는 텍스트의 밀도와 목적에 따라 읽기 속도와 방법을 조절합니다. 이는 독서의 유연성(reading flexibility)이라고 불립니다. 연구에 따르면, 대부분의 성인 독자가 완전한 이해력을 유지하며 읽을 수 있는 속도의 상한선은 분당 500-600 단어(WPM) 수준입니다.',
    stepByStep: [
      '텍스트의 유형을 파악하세요 (소설, 논문, 뉴스 등)',
      '읽기 목적을 명확히 하세요 (즐거움, 학습, 정보 검색)',
      '적절한 읽기 속도를 선택하세요',
      '필요에 따라 속도를 조절하세요',
      '이해도를 지속적으로 모니터링하세요'
    ],
    tips: [
      '복잡한 텍스트는 천천히, 간단한 텍스트는 빠르게 읽으세요',
      '학습 목적일 때는 깊이 있게, 정보 검색 시에는 훑어보기로 읽으세요',
      '이해가 안 되는 부분은 다시 읽는 것을 두려워하지 마세요',
      '정기적으로 읽기 전략을 평가하고 조정하세요'
    ],
    expectedOutcome: '다양한 텍스트와 상황에 맞는 최적의 읽기 전략을 구사할 수 있습니다.',
    duration: '15분',
    difficulty: '고급',
    icon: <Zap className="h-5 w-5" />
  },
  '빠른 시작 훈련': {
    title: '빠른 시작 훈련',
    description: '연구 기반 기본 읽기 능력 향상 훈련입니다',
    scientificBasis: '빠른 시작 훈련은 인지과학 연구를 바탕으로 설계된 체계적인 프로그램입니다. 이 훈련은 읽기 과정에서 발생하는 자연스러운 인지 현상을 이해하고 최적화하는 것이 목표입니다. 키스 레이너와 엘리자베스 쇼터의 연구를 바탕으로, 이해력과 속도의 균형을 찾는 것이 핵심입니다.',
    stepByStep: [
      '읽기 패턴 진단을 통해 현재 상태를 파악하세요',
      '페이서 훈련으로 안구 운동을 최적화하세요',
      '의미 단위 읽기로 청킹 기술을 연습하세요',
      '정기적으로 진행 상황을 평가하세요',
      '개인별 맞춤 전략을 개발하세요'
    ],
    tips: [
      '속발음을 완전히 제거하려 하지 말고 최적화하세요',
      '이해도를 희생하지 않는 선에서 속도를 향상시키세요',
      '정기적인 연습이 가장 중요합니다',
      '개인의 학습 스타일에 맞게 조정하세요'
    ],
    expectedOutcome: '기본적인 읽기 능력이 향상되고, 개인별 최적화된 읽기 전략을 구사할 수 있습니다.',
    duration: '25분',
    difficulty: '초급-중급',
    icon: <BookOpen className="h-5 w-5" />
  },
  '맞춤형 훈련': {
    title: '맞춤형 훈련',
    description: '개인 진단 및 맞춤형 최적화 훈련입니다',
    scientificBasis: '맞춤형 훈련은 개인의 현재 읽기 능력과 목표를 고려하여 설계됩니다. 배들리-히치 모델의 작업 기억 이론을 바탕으로, 개인의 음운 작업 기억력과 시각적 처리 능력을 종합적으로 평가하여 최적의 훈련 계획을 수립합니다.',
    stepByStep: [
      '개인별 읽기 능력 진단을 실시하세요',
      '현재 수준과 목표를 명확히 설정하세요',
      'AI 기반 맞춤형 훈련 계획을 생성하세요',
      '단계별 훈련을 체계적으로 진행하세요',
      '지속적인 모니터링과 조정을 하세요'
    ],
    tips: [
      '정직하게 현재 상태를 평가하세요',
      '현실적인 목표를 설정하세요',
      '꾸준한 연습이 성공의 열쇠입니다',
      '진행 상황을 정기적으로 기록하세요'
    ],
    expectedOutcome: '개인에게 최적화된 읽기 전략을 습득하고, 지속적인 개선을 이룰 수 있습니다.',
    duration: '30분',
    difficulty: '맞춤형',
    icon: <Target className="h-5 w-5" />
  },
  '속도 향상 훈련': {
    title: '속도 향상 훈련',
    description: '인지 병목 현상 극복 및 시각적 처리 강화 훈련입니다',
    scientificBasis: '속도 향상 훈련은 음운 병목 현상을 극복하고 시각적 처리 능력을 강화하는 고급 훈련입니다. 엘리자베스 쇼터의 연구에 따르면, 독서의 병목 현상은 눈의 움직임이 아니라 언어 처리 과정에 있습니다. 이 훈련은 시각공간 스케치패드를 활용하여 더 효율적인 정보 처리를 목표로 합니다.',
    stepByStep: [
      '인지 병목 현상의 원인을 이해하세요',
      '시각화 훈련으로 직관적 이해를 촉진하세요',
      '적응적 속도 훈련으로 유연성을 기르세요',
      '복잡한 텍스트에서의 처리 능력을 향상시키세요',
      '고급 읽기 전략을 습득하세요'
    ],
    tips: [
      '기초가 탄탄해야 고급 기술을 습득할 수 있습니다',
      '시각화는 연습이 필요한 기술입니다',
      '속도보다는 효율성을 우선시하세요',
      '다양한 텍스트 유형으로 연습하세요'
    ],
    expectedOutcome: '고급 읽기 기술을 습득하고, 다양한 텍스트에서 효율적인 읽기가 가능합니다.',
    duration: '35분',
    difficulty: '중급-고급',
    icon: <TrendingUp className="h-5 w-5" />
  }
};

export default function TrainingHelpModal({ isOpen, onClose, exerciseName, sessionType }: TrainingHelpModalProps) {
  const helpContent = helpContents[exerciseName];

  if (!helpContent) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>도움말</DialogTitle>
            <DialogDescription>이 훈련에 대한 도움말 정보가 준비 중입니다.</DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">곧 상세한 도움말이 제공될 예정입니다.</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {helpContent.icon}
            {helpContent.title}
          </DialogTitle>
          <DialogDescription>{helpContent.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="steps">단계별 방법</TabsTrigger>
            <TabsTrigger value="science">과학적 근거</TabsTrigger>
            <TabsTrigger value="tips">팁 & 전략</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    소요 시간
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{helpContent.duration}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    난이도
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{helpContent.difficulty}</Badge>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    기대 효과
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{helpContent.expectedOutcome}</p>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <BookOpen className="h-4 w-4" />
              <AlertDescription>
                이 훈련은 인지과학 연구를 바탕으로 설계되었으며, 개인의 읽기 능력을 체계적으로 향상시키는 것을 목표로 합니다.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>단계별 훈련 방법</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {helpContent.stepByStep.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1 h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="flex-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="science" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>과학적 근거</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{helpContent.scientificBasis}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>효과적인 훈련을 위한 팁</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {helpContent.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <p className="text-sm">{tip}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 