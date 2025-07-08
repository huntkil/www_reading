# 속발음 코칭 프로그램 (Subvocalization Coaching App)

Next.js 기반의 AI 파워드 속발음 훈련 애플리케이션으로, 개인화된 훈련 계획과 실시간 진행 추적을 제공하는 **개인 기록용 앱**입니다.

## 🚀 주요 기능

### 📚 읽기 훈련 관리
- **세션 기록**: 읽기 세션 생성, 수정, 삭제
- **실시간 노트**: 세션 중 실시간 노트 작성 및 저장
- **진행 추적**: 읽기 속도, 이해도, 단어 수 등 상세한 통계

### 🤖 AI 기반 개인화
- **개인화 훈련 계획**: 개인 수준과 목표에 맞는 맞춤형 계획
- **AI 분석**: 세션 데이터 기반 성과 분석 및 개선점 제안
- **스마트 추천**: 다음 훈련 세션을 위한 지능형 추천

### 📊 분석 및 통계
- **대시보드**: 종합적인 진행 상황 및 성과 시각화
- **성과 리포트**: 상세한 성과 분석 및 트렌드 추적
- **목표 관리**: 개인 목표 설정 및 달성도 추적

### 📝 개인 기록 시스템
- **개인 노트**: 훈련 과정과 생각을 기록하는 개인 공간
- **메모 시스템**: 세션별 메모 및 댓글 기능
- **개인 피드**: 개인적인 훈련 기록과 성과 공유

### 🏆 성취 시스템
- **성취 배지**: 목표 달성 시 성취 배지 획득
- **진행 추적**: 단계별 성취 달성 현황
- **동기부여**: 성취를 통한 지속적인 동기부여

### 🔄 데이터 관리
- **로컬 저장**: SQLite 데이터베이스를 통한 안전한 데이터 저장
- **백업 시스템**: 데이터 백업 및 복구 기능
- **데이터 내보내기**: 개인 데이터 내보내기 기능

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Styling**: Tailwind CSS + ShadCN UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Backend
- **Database**: SQLite (개발 및 프로덕션)
- **ORM**: Prisma
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
- SQLite

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
│   │   ├── ai/            # AI 분석 API
│   │   ├── session/       # 세션 관리 API
│   │   ├── note/          # 노트 관리 API
│   │   ├── post/          # 개인 기록 API
│   │   └── ...
│   ├── dashboard/         # 대시보드 페이지
│   ├── training/          # 훈련 페이지
│   ├── community/         # 개인 기록 페이지
│   └── achievements/      # 성취 페이지
├── components/            # React 컴포넌트
│   ├── ui/               # ShadCN UI 컴포넌트
│   ├── Dashboard/        # 대시보드 컴포넌트
│   ├── AI/               # AI 관련 컴포넌트
│   ├── Training/         # 훈련 관련 컴포넌트
│   ├── Community/        # 개인 기록 컴포넌트
│   └── ...
├── lib/                  # 유틸리티 라이브러리
│   ├── ai/               # AI 서비스
│   ├── notes/            # 노트 서비스
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
- **Session**: 읽기 세션 데이터
- **Note**: 실시간 노트 데이터
- **TrainingPlan**: 개인화된 훈련 계획
- **Achievement**: 성취 시스템
- **AIAnalysis**: AI 분석 결과
- **PerformanceStats**: 성과 통계
- **Post/Comment/Like**: 개인 기록 시스템

## 🧪 테스트

```bash
# 모든 테스트 실행
npm test

# 테스트 감시 모드
npm run test:watch

# 테스트 커버리지
npm run test:coverage
```

## 🚀 배포

### Vercel 배포 (권장)

1. **Vercel CLI 설치**:
```bash
npm i -g vercel
```

2. **배포**:
```bash
vercel
```

3. **환경 변수 설정**:
- Vercel 대시보드에서 환경 변수 설정
- OpenAI API 키 등 필수 설정 추가

### 로컬 프로덕션 빌드

```bash
npm run build
npm start
```

## 📝 주요 변경사항

### v0.2.0 - 인증 시스템 제거
- **인증 시스템 완전 제거**: 로그인/회원가입 기능 제거
- **개인 기록용 앱으로 전환**: 단일 사용자 기준으로 설계 변경
- **데이터베이스 스키마 단순화**: User 모델 제거, 관계 단순화
- **의존성 최적화**: JWT, bcryptjs 등 인증 관련 패키지 제거
- **UI/UX 개선**: 인증 관련 UI 제거, 개인 기록 중심으로 재설계

### v0.1.0 - 초기 버전
- 기본 읽기 훈련 기능
- AI 분석 및 추천 시스템
- 실시간 노트 기능
- 커뮤니티 기능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해 주세요. 