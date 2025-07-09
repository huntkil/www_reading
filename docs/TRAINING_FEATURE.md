# Training Feature Development Documentation

이 문서는 Subvocalization Coaching 애플리케이션의 **Training Feature (속도 향상 훈련)** 개발 과정을 기록합니다.

## 1. 목표

- 사용자가 AI 추천 섹션에서 "훈련 시작" 버튼을 클릭하면 체계적인 단계별 속도 향상 훈련을 진행할 수 있도록 합니다.
- 훈련 중에는 타이머, WPM, 정확도, 입력 문자 수 등의 실시간 통계를 제공하여 학습자의 집중도를 높입니다.
- UI 컴포넌트는 **ShadCN** 라이브러리를 사용하여 일관된 디자인 시스템을 유지합니다.

## 2. 주요 구현 사항

| 날짜 | 작업 | 상세 내용 |
|------|------|-----------|
| 2025-07-08 | ShadCN `dialog` 컴포넌트 추가 | `npx shadcn@latest add dialog` 명령으로 `/components/ui/dialog.tsx` 생성 |
| 2025-07-08 | 훈련 모달 ShadCN `Dialog`로 교체 | 기존 커스텀 오버레이→ShadCN `Dialog` + `Button` 컴포넌트 사용 (`app/page.tsx`) |
| 2025-07-08 | 진행 상황 문서화 | `docs/TRAINING_FEATURE.md` 파일 신규 작성 |
| 2025-07-08 | 체계적인 단계별 훈련 시스템 구현 | 3개 모듈, 각 모듈당 3단계로 구성된 체계적인 훈련 시스템 구현 |
| 2025-07-08 | 훈련 텍스트 자료 생성 | 초급/중급/고급 단계별 훈련 텍스트 및 이해도 체크 질문 생성 |

## 3. 훈련 시스템 구조

### 3.1 모듈 구성

#### 모듈 1: 기초 속발음 제어 훈련 (초급, 15분)
- **목표**: 내면의 목소리를 이해하고 효율적으로 관리하는 방법 학습
- **단계**:
  1. 속발음 이해하기 (강의)
  2. 물리적 속발음 억제 훈련 (껌 씹기, 허밍)
  3. 허밍/카운팅 훈련

#### 모듈 2: 시각적 처리 및 청킹 훈련 (중급, 20분)
- **목표**: 여러 단어를 동시에 인식하고 의미 단위로 처리하는 능력 향상
- **단계**:
  1. 청킹(Chunking) 이해하기 (강의)
  2. 2-3단어 청킹 훈련
  3. 구문 단위 청킹 훈련

#### 모듈 3: 스킬드 리딩 및 스캔 훈련 (고급, 25분)
- **목표**: 특정 정보를 빠르게 찾아내고 핵심 내용을 파악하는 능력 향상
- **단계**:
  1. 스킬드 리딩 이해하기 (강의)
  2. 키워드 스캔 훈련
  3. 개요 파악 훈련

### 3.2 훈련 세션 상태 관리

각 단계는 다음 상태를 순차적으로 진행합니다:

1. **lesson**: 강의 내용 학습
2. **exercise**: 훈련 방법 설명 및 타이머 실행
3. **reading**: 실제 텍스트 읽기
4. **comprehension**: 이해도 체크 퀴즈
5. **complete**: 결과 표시 및 다음 단계 진행

### 3.3 성능 측정

- **WPM (Words Per Minute)**: 읽기 속도 측정
- **이해도 점수**: 퀴즈 정답률 기반 이해도 측정
- **실시간 피드백**: 성과에 따른 맞춤형 피드백 제공

## 4. 파일 변경 내역

### 4.1 컴포넌트 파일
1. **components/Training/TrainingSession.tsx**
   - 체계적인 단계별 훈련 시스템 구현
   - 3개 모듈, 각 모듈당 3단계 구성
   - 실시간 타이머, WPM 계산, 이해도 체크 기능
   - ShadCN 컴포넌트 활용 (Card, Button, Progress, Alert, Badge, RadioGroup)

2. **components/Training/TrainingHelpModal.tsx**
   - 훈련 도움말 모달 컴포넌트
   - 각 훈련 유형별 상세 설명 제공

3. **components/ui/radio-group.tsx** (자동 생성)
   - 이해도 체크 퀴즈용 라디오 버튼 컴포넌트

### 4.2 훈련 텍스트 파일
1. **SubvocalizationCoaching/03-TrainingTexts/beginner/01-basic-subvocalization-control.md**
   - 기초 속발음 제어 훈련 텍스트
   - 4개 이해도 체크 질문 포함

2. **SubvocalizationCoaching/03-TrainingTexts/intermediate/01-chunking-training.md**
   - 청킹 훈련 텍스트
   - 5개 이해도 체크 질문 포함

3. **SubvocalizationCoaching/03-TrainingTexts/advanced/01-skilled-reading.md**
   - 스킬드 리딩 훈련 텍스트
   - 6개 이해도 체크 질문 포함

### 4.3 API 및 라이브러리
1. **app/api/ai/plan/route.ts**
   - AI 훈련 계획 생성 API
   - Mock 데이터 기반 개인화된 훈련 계획 제공

2. **lib/ai/analysis.ts**
   - AI 분석 라이브러리
   - 훈련 계획 생성 및 성과 분석 기능

## 5. 사용 방법

1. 메인 페이지에서 **AI 추천 > "훈련 시작"** 버튼 클릭
2. AI가 생성한 개인 맞춤형 훈련 계획 확인
3. **훈련 시작** 클릭 시 체계적인 단계별 훈련 모드로 진입
4. 각 단계별로 강의 → 훈련 → 읽기 → 이해도 체크 순서로 진행
5. 실시간 성과 측정 및 피드백 제공
6. 모듈 완료 시 전체 성과 요약 및 다음 모듈 진행

## 6. 기술적 특징

### 6.1 상태 관리
- React useState를 활용한 복잡한 훈련 상태 관리
- 단계별 진행 상황 추적
- 실시간 타이머 및 성과 측정

### 6.2 UI/UX
- ShadCN 컴포넌트 기반 일관된 디자인
- 반응형 레이아웃 지원
- 직관적인 진행 상황 표시
- 실시간 피드백 시스템

### 6.3 성능 측정
- 정확한 WPM 계산 알고리즘
- 이해도 기반 성과 평가
- 개인별 맞춤형 피드백

## 7. 향후 개선 사항

- [ ] 실제 OpenAI API 연동하여 AI 분석 기능 구현
- [ ] 사용자별 훈련 이력 저장 및 분석
- [ ] 더 다양한 훈련 텍스트 및 난이도 추가
- [ ] 모바일 최적화 및 터치 인터페이스 개선
- [ ] 다크 모드 지원
- [ ] 훈련 결과 통계 및 차트 시각화
- [ ] 소셜 기능 (친구와 훈련 결과 공유)
- [ ] 게임화 요소 추가 (업적, 뱃지 시스템)

## 8. 참고 자료

- ShadCN 컴포넌트 가이드: <https://ui.shadcn.com>
- Radix UI Dialog docs: <https://www.radix-ui.com/docs/primitives/components/dialog>
- 인지과학 기반 읽기 연구: 키스 레이너, 엘리자베스 쇼터 연구
- 작업 기억 모델: 배들리-히치 모델 