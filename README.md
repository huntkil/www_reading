# 속발음 코칭 프로그램 (Subvocalization Coaching App)

Next.js 기반의 AI 파워드 속발음 훈련 애플리케이션으로, 개인화된 훈련 계획과 실시간 진행 추적을 제공하는 **개인 기록용 앱**입니다.

---

## 🚀 주요 기능

- **체계적 단계별 읽기 훈련**: 모듈/단계별 훈련, 실시간 타이머, WPM/정확도 측정
- **AI 기반 개인화**: OpenAI API 기반 맞춤형 훈련 계획/분석/추천
- **실시간 노트/기록/성과 추적**: 세션별 노트, 대시보드, 성취 시스템
- **ShadCN UI + Lucide 아이콘**: 일관된 UI/UX, 모든 컴포넌트 타입 안전
- **데이터 관리**: SQLite(개발)/PostgreSQL(운영), Prisma ORM
- **테스트/품질 관리**: Jest, ESLint, 100% TypeScript

---

## 🛠️ 기술/개발 규칙

- **UI**: ShadCN 컴포넌트만 사용, `/components/ui`에 위치
- **아이콘**: Lucide React만 사용, `import {Icon} from 'lucide-react'`
- **타입**: 모든 컴포넌트/함수/데이터에 TypeScript 타입 명시
- **코드 스타일**: ESLint, Prettier, ShadCN 스타일 가이드 준수
- **폴더 구조**: 기능별 디렉토리, UI/비즈니스/페이지 컴포넌트 분리
- **커밋/협업**: 기능 단위 커밋, 상세 메시지, PR 리뷰 권장

---

## 📁 폴더 구조 (2025.07 기준)

```
reading/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트 (AI, 세션, 노트, 성취 등)
│   ├── dashboard/         # 대시보드 페이지
│   ├── training/          # 훈련 페이지
│   ├── community/         # 개인 기록 페이지
│   └── achievements/      # 성취 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # ShadCN UI 컴포넌트
│   ├── Training/         # 훈련 관련 컴포넌트
│   ├── Dashboard/        # 대시보드 컴포넌트
│   ├── AI/               # AI 관련 컴포넌트
│   └── ...
├── lib/                  # 유틸리티/서비스/AI/분석/DB
├── prisma/               # 데이터베이스 스키마
├── hooks/                # 커스텀 React 훅
├── docs/                 # 개발/기능 문서
├── __tests__/            # 테스트 파일
└── SubvocalizationCoaching/ # 훈련 텍스트/템플릿
```

---

## 🧑‍💻 개발 가이드

- **설치**: `npm install`
- **개발 서버**: `npm run dev`
- **Lint**: `npm run lint` (오류 0 유지)
- **타입 체크**: `npm run type-check`
- **테스트**: `npm test`
- **배포**: Vercel 권장, `DEPLOYMENT.md` 참고
- **환경 변수**: `.env.example` 참고, OpenAI 등 필수

---

## 🤝 협업/커밋 규칙

- 기능/버그 단위 브랜치, 상세 커밋 메시지
- PR 리뷰/테스트 후 main/feature 브랜치 병합
- 코드 스타일/타입/테스트/빌드 오류 0 유지
- ShadCN/Lucide/TypeScript 규칙 위반 금지

---

## 📄 참고 문서
- [docs/TRAINING_FEATURE.md](docs/TRAINING_FEATURE.md): 훈련 기능 상세
- [개발순서.md](개발순서.md): 개발 단계/체크리스트
- [DEPLOYMENT.md](DEPLOYMENT.md): 배포 가이드
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md): 전체 개요 