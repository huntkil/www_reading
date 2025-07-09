# Training Feature 개발 문서 (2025.07)

## 1. 목표/개요
- AI 추천 기반 단계별 읽기 훈련 (모듈/단계/실시간 측정)
- ShadCN UI, Lucide, 타입스크립트, lint 0, 코드 스타일 준수
- 개인화된 훈련 경험과 실시간 성과 측정

## 2. 주요 구현 사항
- **TrainingSession/TrainingHelpModal/ModuleSelector/ReadingSelector** 등 컴포넌트 분리
- **단계별 상태**: lesson → exercise → reading → comprehension → complete
- **실시간 타이머, WPM/정확도/피드백**, ShadCN UI 적용
- **텍스트 크기 조절**: 4단계 (small, medium, large, xlarge) 실시간 조절
- **즉시 시작 기능**: 모듈/읽기 선택 시 자동으로 다음 단계 진행
- **모든 타입 명시**, any 금지, 재사용성/확장성 중시

## 3. 사용법
1. AI 추천 > "훈련 시작" 클릭
2. 모듈 선택 시 자동으로 읽기 선택 단계로 진행
3. 읽기 자료 선택 시 자동으로 훈련 시작
4. 각 단계별로 강의→훈련→읽기→이해도 체크 순서 진행
5. 실시간 성과 측정/피드백/요약 제공
6. 텍스트 크기 조절 버튼으로 가독성 향상

## 4. 코드/구조 예시
- `/components/Training/TrainingSession.tsx`: 단계별 상태/타이머/성과 측정/피드백/모듈 구조
- `/components/Training/TrainingHelpModal.tsx`: 훈련 도움말/설명/모달
- `/components/Training/ModuleSelector.tsx`: 모듈 선택 및 즉시 진행
- `/components/Training/ReadingSelector.tsx`: 읽기 자료 선택 및 즉시 시작
- `/components/ui/`: ShadCN UI 컴포넌트만 사용
- 타입스크립트, ESLint, Lucide 규칙 준수

## 5. 최신 기능
- **텍스트 크기 조절**: 훈련 중 실시간 텍스트 크기 변경
- **즉시 시작**: 선택 시 자동으로 다음 단계 진행
- **콘솔 로그 제거**: 프로덕션 환경 최적화
- **향상된 UI/UX**: 더 직관적인 훈련 플로우

## 6. 향후 개선 사항
- [ ] OpenAI 실제 연동/AI 분석/추천
- [ ] 훈련 이력/통계/차트/게임화/모바일 최적화
- [ ] 커버리지 80% 이상 테스트/자동화
- [ ] 고급 분석 및 개인화 추천 시스템

## 7. 참고
- ShadCN: https://ui.shadcn.com
- Lucide: https://lucide.dev
- Radix UI: https://www.radix-ui.com/docs/primitives/components/dialog

## 8. 관련 문서
- [LATEST_FEATURES.md](./LATEST_FEATURES.md): 최신 기능 상세
- [README.md](../README.md): 프로젝트 개요
- [개발순서.md](../개발순서.md): 개발 단계 