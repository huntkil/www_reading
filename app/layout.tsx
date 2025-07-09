import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { HeaderContent } from '@/components/HeaderContent'
import { Toaster } from '@/components/ui/toaster'
import { BookOpen, Github, Mail, Heart } from 'lucide-react'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Subvocalization Coaching',
      description: '서브보컬라이제이션 코칭 프로그램',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b backdrop-blur bg-background/95">
              <div className="container flex items-center justify-between h-14">
                <HeaderContent />
              </div>
            </header>
            <main className="flex-1 container py-6">{children}</main>
            <footer className="border-t bg-muted/30">
              <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {/* 브랜드 섹션 */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-6 w-6" />
                      <span className="font-bold text-lg">Subvocalization Coaching</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      AI 기반 속독 훈련으로 당신의 독서 능력을 한 단계 끌어올리세요.
                    </p>
                  </div>

                  {/* 빠른 링크 */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">빠른 링크</h3>
                    <div className="space-y-2 text-sm">
                      <Link href="/" className="block text-muted-foreground hover:text-foreground transition-colors">
                        대시보드
                      </Link>
                      <Link href="/training" className="block text-muted-foreground hover:text-foreground transition-colors">
                        훈련
                      </Link>
                      <Link href="/community" className="block text-muted-foreground hover:text-foreground transition-colors">
                        커뮤니티
                      </Link>
                    </div>
                  </div>

                  {/* 지원 */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">지원</h3>
                    <div className="space-y-2 text-sm">
                      <Link href="/help" className="block text-muted-foreground hover:text-foreground transition-colors">
                        도움말
                      </Link>
                      <Link href="/faq" className="block text-muted-foreground hover:text-foreground transition-colors">
                        자주 묻는 질문
                      </Link>
                      <Link href="/contact" className="block text-muted-foreground hover:text-foreground transition-colors">
                        문의하기
                      </Link>
                    </div>
                  </div>

                  {/* 연락처 */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">연락처</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>support@svc.com</span>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Github className="h-4 w-4" />
                        <Link href="https://github.com" className="hover:text-foreground transition-colors">
                          GitHub
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 저작권 */}
                <div className="border-t mt-8 pt-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Subvocalization Coaching. All rights reserved.
                    <span className="inline-flex items-center mx-2">
                      Made with <Heart className="h-3 w-3 mx-1 text-red-500" /> for better reading
                    </span>
                  </p>
                </div>
              </div>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
} 