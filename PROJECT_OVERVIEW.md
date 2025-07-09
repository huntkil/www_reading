# 속발음 코칭 프로그램 - 프로젝트 개요 (2025.07)

## 🎯 프로젝트 소개

- Next.js 14 기반, AI 파워드 읽기 훈련/기록 앱
- **단일 사용자** 개인 기록/분석/추천에 집중 (인증/회원가입 제거)
- ShadCN UI, Lucide, 100% TypeScript, ESLint, Jest, Prisma, OpenAI

## 🚀 핵심 기능

- 단계별 읽기 훈련 (모듈/단계/실시간 측정)
- AI 기반 개인화 계획/분석/추천
- 실시간 노트/기록/성과/성취 시스템
- 대시보드/통계/리포트/목표 관리
- 데이터 관리(로컬 SQLite/운영 PostgreSQL)
- 완전한 API/테스트/배포 자동화

## 🛠️ 기술/개발 규칙

- ShadCN UI, Lucide, TypeScript, ESLint, Prettier, 기능별 폴더 구조
- 모든 컴포넌트/함수/데이터 타입 명시, 재사용성/확장성 중시
- 커밋/PR/테스트/배포 자동화, 상세 메시지/리뷰 권장

## 📁 폴더 구조 (2025.07)

- app/: Next.js App Router, API, 페이지
- components/: ShadCN UI, Training, Dashboard 등
- lib/: 서비스/AI/분석/DB/유틸
- prisma/: DB 스키마
- docs/: 개발/기능 문서
- __tests__/: 테스트

## 🔄 워크플로우/체크리스트

- Lint/타입/테스트/빌드 오류 0 유지
- 기능 단위 브랜치/커밋/PR
- ShadCN/Lucide/TypeScript 규칙 위반 금지
- 배포 전 환경 변수/DB 마이그레이션/테스트 필수

## 📄 참고 문서
- [README.md](./README.md)
- [개발순서.md](./개발순서.md)
- [DEPLOYMENT.md](./DEPLOYMENT.md)
- [docs/TRAINING_FEATURE.md](./docs/TRAINING_FEATURE.md) 