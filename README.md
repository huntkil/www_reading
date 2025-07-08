# 속발음 코칭 프로그램 (Subvocalization Coaching App)

Next.js 기반의 AI 파워드 속발음 훈련 애플리케이션으로, 개인화된 훈련 계획과 실시간 진행 추적을 제공합니다.

## 🚀 주요 기능

### 📚 읽기 훈련 관리
- **세션 기록**: 읽기 세션 생성, 수정, 삭제
- **실시간 노트**: 세션 중 실시간 노트 작성 및 저장
- **진행 추적**: 읽기 속도, 이해도, 단어 수 등 상세한 통계

### 🤖 AI 기반 개인화
- **개인화 훈련 계획**: 사용자 수준과 목표에 맞는 맞춤형 계획
- **AI 분석**: 세션 데이터 기반 성과 분석 및 개선점 제안
- **스마트 추천**: 다음 훈련 세션을 위한 지능형 추천

### 📊 분석 및 통계
- **대시보드**: 종합적인 진행 상황 및 성과 시각화
- **성과 리포트**: 상세한 성과 분석 및 트렌드 추적
- **목표 관리**: 개인 목표 설정 및 달성도 추적

### 🔐 사용자 관리
- **인증 시스템**: JWT 기반 로그인/회원가입
- **프로필 관리**: 사용자 정보 및 설정 관리
- **레벨 시스템**: 초급/중급/고급 레벨별 맞춤 서비스

### 👥 커뮤니티 기능
- **성취 시스템**: 목표 달성 시 성취 배지 획득
- **소셜 피드**: 훈련 성과 공유 및 동기부여
- **댓글 및 좋아요**: 커뮤니티 상호작용

### 🔄 데이터 동기화
- **실시간 동기화**: 여러 기기 간 데이터 동기화
- **백업 시스템**: 안전한 데이터 백업 및 복구
- **오프라인 지원**: 네트워크 없이도 기본 기능 사용

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS + ShadCN UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: SQLite (개발) / PostgreSQL (프로덕션)
- **ORM**: Prisma
- **Authentication**: JWT + bcryptjs
- **API**: Next.js API Routes

### AI & Analytics
- **AI Service**: OpenAI API
- **Analysis**: 커스텀 분석 엔진
- **Recommendations**: 머신러닝 기반 추천 시스템

### Development Tools
- **Language**: TypeScript
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint
- **Package Manager**: npm

## 🚀 시작하기

### 필수 요구사항

- Node.js 18+
- npm 또는 yarn
- SQLite (개발용)

### 설치 및 실행

1. **저장소 클론**:
```bash
git clone <repository-url>
cd reading
```

2. **의존성 설치**:
```bash
npm install
```

3. **환경 변수 설정**:
```bash
cp .env.example .env.local
# .env.local 파일을 편집하여 설정 추가
```

4. **데이터베이스 설정**:
```bash
npx prisma generate
npx prisma db push
```

5. **개발 서버 실행**:
```bash
npm run dev
```

애플리케이션은 `http://localhost:3000`에서 실행됩니다.

## 📁 프로젝트 구조

```
reading/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   ├── auth/          # 인증 관련 API
│   │   ├── ai/            # AI 분석 API
│   │   ├── session/       # 세션 관리 API
│   │   ├── note/          # 노트 관리 API
│   │   └── ...
│   ├── dashboard/         # 대시보드 페이지
│   ├── training/          # 훈련 페이지
│   ├── community/         # 커뮤니티 페이지
│   └── achievements/      # 성취 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # ShadCN UI 컴포넌트
│   ├── Auth/             # 인증 관련 컴포넌트
│   ├── Dashboard/        # 대시보드 컴포넌트
│   ├── AI/               # AI 관련 컴포넌트
│   ├── Training/         # 훈련 관련 컴포넌트
│   ├── Community/        # 커뮤니티 컴포넌트
│   └── ...
├── lib/                  # 유틸리티 라이브러리
│   ├── ai/               # AI 서비스
│   ├── auth/             # 인증 로직
│   ├── prisma.ts         # 데이터베이스 클라이언트
│   └── ...
├── prisma/               # 데이터베이스 스키마
├── hooks/                # 커스텀 React 훅
├── contexts/             # React Context
└── __tests__/            # 테스트 파일
```

## 🔧 개발 스크립트

- `npm run dev` - 파일 시스템 감시 비활성화로 개발 서버 실행 (EMFILE 이슈 방지)
- `npm run dev:watch` - 파일 시스템 감시 활성화로 개발 서버 실행
- `npm run dev:poll` - 폴링 방식으로 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run start` - 프로덕션 서버 실행
- `npm run lint` - ESLint 실행
- `npm test` - 테스트 실행
- `npm run type-check` - TypeScript 타입 체크

## 🐛 EMFILE (Too Many Open Files) 문제 해결

macOS에서 "EMFILE: too many open files" 오류가 발생하는 경우:

### 빠른 해결책
기본 dev 스크립트 사용 (파일 시스템 감시 비활성화):
```bash
npm run dev
```

### 대안 해결책

1. **폴링 방식 사용**:
```bash
npm run dev:poll
```

2. **시스템 파일 제한 증가 (macOS)**:
```bash
ulimit -n 65536
```

3. **watchman 설치 및 설정**:
```bash
brew install watchman
```

4. **Next.js 캐시 정리**:
```bash
rm -rf .next
npm run dev
```

## 📊 데이터베이스 스키마

### 주요 모델
- **User**: 사용자 정보 및 설정
- **Session**: 읽기 세션 데이터
- **Note**: 실시간 노트 데이터
- **TrainingPlan**: 개인화된 훈련 계획
- **Achievement**: 성취 시스템
- **AIAnalysis**: AI 분석 결과
- **PerformanceStats**: 성과 통계
- **Post/Comment/Like**: 커뮤니티 기능

## 🧪 테스트

```bash
# 모든 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch

# 테스트 커버리지 확인
npm run test:coverage
```

## 🚀 배포

### Vercel 배포 (권장)
1. Vercel 계정 생성
2. GitHub 저장소 연결
3. 환경 변수 설정
4. 자동 배포

### 환경 변수
```env
# 데이터베이스
DATABASE_URL="file:./dev.db"

# 인증
JWT_SECRET="your-jwt-secret"

# AI 서비스
OPENAI_API_KEY="your-openai-api-key"

# 기타
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🤝 기여하기

1. 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 있거나 질문이 있으시면 이슈를 생성해주세요. 