# Training Feature Development Documentation

이 문서는 Subvocalization Coaching 애플리케이션의 **Training Feature (속도 향상 훈련)** 개발 과정을 기록합니다.

## 1. 목표

- 사용자가 AI 추천 섹션에서 "훈련 시작" 버튼을 클릭하면 20분 간의 속도 향상 훈련을 진행할 수 있도록 합니다.
- 훈련 중에는 타이머, WPM, 정확도, 입력 문자 수 등의 실시간 통계를 제공하여 학습자의 집중도를 높입니다.
- UI 컴포넌트는 **ShadCN** 라이브러리를 사용하여 일관된 디자인 시스템을 유지합니다.

## 2. 주요 구현 사항

| 날짜 | 작업 | 상세 내용 |
|------|------|-----------|
| 2025-07-08 | ShadCN `dialog` 컴포넌트 추가 | `npx shadcn@latest add dialog` 명령으로 `/components/ui/dialog.tsx` 생성 |
| 2025-07-08 | 훈련 모달 ShadCN `Dialog`로 교체 | 기존 커스텀 오버레이→ShadCN `Dialog` + `Button` 컴포넌트 사용 (`app/page.tsx`) |
| 2025-07-08 | 진행 상황 문서화 | `docs/TRAINING_FEATURE.md` 파일 신규 작성 |

## 3. 파일 변경 내역

1. **app/page.tsx**
   - ShadCN `Dialog`, `Button` 임포트 추가
   - 기존 모달 마크업 삭제 → ShadCN `Dialog` 기반 모달로 교체
2. **components/ui/dialog.tsx** (자동 생성)
   - Radix UI와 Lucide Icon 기반의 재사용 가능한 `Dialog` 컴포넌트
3. **docs/TRAINING_FEATURE.md** (신규)
   - 현재 문서화 파일

## 4. 사용 방법

1. 메인 페이지에서 **AI 추천 > "훈련 시작"** 버튼 클릭
2. ShadCN `Dialog` 모달이 표시되며 훈련 설명 및 시작/취소 버튼 제공
3. **훈련 시작** 클릭 시 실제 훈련 모드로 진입
4. 타이머가 0이 되면 `alert`로 훈련 완료 안내

## 5. 향후 개선 사항

- `TrainingModal` 및 `TrainingSession` 로직을 별도 컴포넌트로 분리하여 유지보수성 향상
- 훈련 결과를 서버(DB)에 저장하여 대시보드와 연동
- AI 분석 결과를 바탕으로 난이도와 목표 WPM 동적 조절
- 모바일 레이아웃 최적화, 다크 모드 지원

## 6. 참고

- ShadCN 컴포넌트 가이드: <https://ui.shadcn.com>
- Radix UI Dialog docs: <https://www.radix-ui.com/docs/primitives/components/dialog> 