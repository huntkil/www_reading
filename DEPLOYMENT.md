# 속발음 코칭 프로그램 배포 가이드

## 🚀 배포 개요

이 프로젝트는 **Vercel**을 사용하여 배포됩니다. MCP 서버는 제거되었으며, 모든 기능이 데이터베이스 기반으로 통합되어 단일 플랫폼에서 운영됩니다.

## 📋 배포 전 체크리스트

### 필수 환경 변수
```env
# 데이터베이스 (SQLite for development, PostgreSQL for production)
DATABASE_URL="file:./dev.db"

# 인증
JWT_SECRET="your-super-secret-jwt-key-here"

# AI 서비스
OPENAI_API_KEY="sk-your-openai-api-key"

# NextAuth (선택사항)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### 빌드 전 확인사항
- [ ] 모든 TypeScript 에러 해결
- [ ] 테스트 통과 확인
- [ ] 환경 변수 설정 완료
- [ ] 데이터베이스 마이그레이션 준비

## 🎯 Vercel 배포 (권장)

### 1. Vercel 계정 설정
1. [Vercel](https://vercel.com)에 가입
2. GitHub 계정 연결
3. 새 프로젝트 생성

### 2. 저장소 연결
```bash
# GitHub 저장소를 Vercel에 연결
1. Vercel 대시보드에서 "New Project" 클릭
2. GitHub 저장소 선택
3. 프로젝트 설정 확인
```

### 3. 환경 변수 설정
Vercel 대시보드에서 다음 환경 변수를 설정:

```env
# 필수 환경 변수
DATABASE_URL="postgresql://username:password@host:port/database"
JWT_SECRET="your-super-secret-jwt-key-here"
OPENAI_API_KEY="sk-your-openai-api-key"

# 선택사항
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```

### 4. 빌드 설정
```json
// vercel.json (선택사항)
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 5. 배포 실행
```bash
# 자동 배포 (GitHub 연동 시)
git push origin main

# 수동 배포
vercel --prod
```

## 🗄️ 데이터베이스 설정

### 개발 환경 (SQLite)
```bash
# 로컬 개발용 SQLite
npx prisma generate
npx prisma db push
```

### 프로덕션 환경 (PostgreSQL)
1. **Vercel Postgres** 사용 (권장)
   ```bash
   # Vercel CLI로 Postgres 생성
   vercel storage create postgres
   ```

2. **외부 PostgreSQL** 사용
   ```env
   DATABASE_URL="postgresql://username:password@host:port/database"
   ```

### 데이터베이스 마이그레이션
```bash
# 프로덕션 데이터베이스 마이그레이션
npx prisma migrate deploy
npx prisma generate
```

## 🔧 배포 후 설정

### 1. 도메인 설정
```bash
# 커스텀 도메인 연결 (선택사항)
vercel domains add your-domain.com
```

### 2. SSL 인증서
- Vercel에서 자동으로 SSL 인증서 제공
- 커스텀 도메인 사용 시 자동 SSL 설정

### 3. 환경 변수 업데이트
```env
# 프로덕션 URL로 업데이트
NEXTAUTH_URL="https://your-domain.vercel.app"
```

## 📊 모니터링 및 로깅

### Vercel Analytics
```bash
# Vercel Analytics 활성화
vercel analytics enable
```

### 로그 확인
```bash
# 실시간 로그 확인
vercel logs

# 특정 함수 로그
vercel logs --function api/auth/login
```

## 🔄 CI/CD 파이프라인

### GitHub Actions (선택사항)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 문제 해결

### 일반적인 배포 문제

#### 1. 빌드 실패
```bash
# 로컬에서 빌드 테스트
npm run build

# TypeScript 에러 확인
npm run type-check
```

#### 2. 환경 변수 문제
```bash
# 환경 변수 확인
vercel env ls

# 환경 변수 추가
vercel env add DATABASE_URL
```

#### 3. 데이터베이스 연결 문제
```bash
# 데이터베이스 상태 확인
npx prisma db pull
npx prisma generate
```

### 성능 최적화

#### 1. 번들 크기 최적화
```bash
# 번들 분석
npm run build
# .next/analyze/ 폴더에서 분석 결과 확인
```

#### 2. 이미지 최적화
```typescript
// next.config.js
module.exports = {
  images: {
    domains: ['your-image-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

## 🔒 보안 설정

### 1. 환경 변수 보안
- 민감한 정보는 항상 환경 변수로 관리
- API 키는 정기적으로 로테이션

### 2. CORS 설정
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
        ],
      },
    ]
  },
}
```

### 3. Rate Limiting
```typescript
// API 라우트에 rate limiting 적용
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // IP당 최대 요청 수
})
```

## 📈 성능 모니터링

### Vercel Analytics
- 페이지 로드 시간
- 사용자 행동 분석
- 에러 추적

### 커스텀 모니터링
```typescript
// 성능 메트릭 수집
export function trackPerformance(metric: string, value: number) {
  // 분석 서비스로 전송
  console.log(`Performance: ${metric} = ${value}`)
}
```

## 🔄 롤백 전략

### 1. Vercel 롤백
```bash
# 이전 배포로 롤백
vercel rollback

# 특정 배포로 롤백
vercel rollback <deployment-url>
```

### 2. 데이터베이스 롤백
```bash
# 마이그레이션 롤백
npx prisma migrate reset
npx prisma migrate deploy
```

## 💰 비용 최적화

### Vercel 요금제
- **Hobby**: 무료 (개인 프로젝트)
- **Pro**: $20/월 (팀 프로젝트)
- **Enterprise**: 맞춤형 (대규모 프로젝트)

### 비용 절약 팁
1. **이미지 최적화**: WebP/AVIF 포맷 사용
2. **번들 최적화**: 불필요한 의존성 제거
3. **캐싱 전략**: 정적 자산 캐싱 활용
4. **CDN 활용**: Vercel의 글로벌 CDN 활용

## 📞 지원 및 문서

### 유용한 링크
- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)

### 문제 해결
- Vercel 대시보드의 로그 확인
- GitHub Issues에서 유사한 문제 검색
- Vercel 지원팀 문의

## 🎉 배포 완료 후 체크리스트

- [ ] 모든 페이지 정상 로드 확인
- [ ] API 엔드포인트 동작 확인
- [ ] 데이터베이스 연결 확인
- [ ] 인증 시스템 동작 확인
- [ ] AI 서비스 동작 확인
- [ ] 모바일 반응형 확인
- [ ] 성능 테스트 실행
- [ ] 보안 스캔 실행
- [ ] 백업 시스템 설정
- [ ] 모니터링 알림 설정 