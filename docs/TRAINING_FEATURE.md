# Training Feature 개발 문서 (2025.07)

## 1. 목표/개요
- AI 추천 기반 단계별 읽기 훈련 (모듈/단계/실시간 측정)
- ShadCN UI, Lucide, 타입스크립트, lint 0, 코드 스타일 준수

## 2. 주요 구현 사항
- TrainingSession/TrainingHelpModal/ModuleSelector/ReadingSelector 등 컴포넌트 분리
- 단계별 상태: lesson → exercise → reading → comprehension → complete
- 실시간 타이머, WPM/정확도/피드백, ShadCN UI 적용
- 모든 타입 명시, any 금지, 재사용성/확장성 중시

## 3. 사용법
1. AI 추천 > "훈련 시작" 클릭
2. 모듈/단계/텍스트 선택 후 훈련 시작
3. 각 단계별로 강의→훈련→읽기→이해도 체크 순서 진행
4. 실시간 성과 측정/피드백/요약 제공

## 4. 코드/구조 예시
- `/components/Training/TrainingSession.tsx`: 단계별 상태/타이머/성과 측정/피드백/모듈 구조
- `/components/Training/TrainingHelpModal.tsx`: 훈련 도움말/설명/모달
- `/components/ui/`: ShadCN UI 컴포넌트만 사용
- 타입스크립트, ESLint, Lucide 규칙 준수

## 5. 향후 개선 사항
- [ ] OpenAI 실제 연동/AI 분석/추천
- [ ] 훈련 이력/통계/차트/게임화/모바일 최적화
- [ ] 커버리지 80% 이상 테스트/자동화

## 6. 참고
- ShadCN: https://ui.shadcn.com
- Lucide: https://lucide.dev
- Radix UI: https://www.radix-ui.com/docs/primitives/components/dialog 