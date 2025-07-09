# 속발음 코칭 프로그램 배포 가이드 (2025.07)

## 🚀 배포 개요
- Vercel 권장, SQLite(개발)/PostgreSQL(운영), Prisma ORM
- lint/type-check/test/빌드 오류 0 필수
- 환경 변수: .env.example 참고, OpenAI 등 필수

## 📋 배포 전 체크리스트
- [x] 모든 TypeScript/lint/test 오류 0
- [x] 환경 변수 설정 완료
- [x] DB 마이그레이션/백업 준비
- [x] Vercel/로컬 빌드 테스트

## 🎯 Vercel 배포
1. Vercel 계정/CLI 설치, GitHub 연동
2. 환경 변수(Vercel 대시보드) 설정
3. `npm run build`/`npm run lint`/`npm run type-check`/`npm test` 통과 확인
4. `git push` → 자동 배포

## 🗄️ 데이터베이스
- 개발: SQLite, 운영: PostgreSQL
- Prisma 마이그레이션 필수

## 🧑‍💻 개발/운영 워크플로우
- 기능 단위 브랜치/커밋/PR, 상세 메시지
- lint/type/test/빌드 오류 0 유지
- ShadCN/Lucide/TypeScript 규칙 위반 금지
- 배포 전 환경 변수/DB/테스트 필수

## 📄 참고 문서
- [README.md](README.md)
- [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
- [개발순서.md](개발순서.md) 