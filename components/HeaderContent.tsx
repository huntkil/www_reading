"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';

import { Loader2, Home, BarChart3, Users, BookOpen, Trophy, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function HeaderContent() {
  const { user, isAuthenticated, isLoading, logout, openAuthModal } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: '/', label: '홈', icon: Home },
    { href: '/dashboard', label: '대시보드', icon: BarChart3 },
    { href: '/training', label: '훈련', icon: BookOpen },
    { href: '/community', label: '커뮤니티', icon: Users },
    { href: '/achievements', label: '성취', icon: Trophy },
  ];

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <div className="flex items-center space-x-6">
        <Link href="/" className="font-bold text-lg flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="hidden sm:inline">Subvocalization Coaching</span>
          <span className="sm:hidden">SVC</span>
        </Link>
        
        {/* 데스크톱 네비게이션 메뉴 */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="h-4 w-4 inline mr-1" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {/* 모바일 메뉴 */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col space-y-4 mt-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleMobileNavClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="border-t pt-4 mt-4">
                {isLoading ? (
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm">로딩 중...</span>
                  </div>
                ) : isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      안녕하세요, {user?.name}님
                    </div>
                    <Button 
                      onClick={() => {
                        logout();
                        handleMobileNavClick();
                      }} 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      로그아웃
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      openAuthModal();
                      handleMobileNavClick();
                    }} 
                    className="w-full justify-start"
                  >
                    로그인
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* 데스크톱 인증 버튼 */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : isAuthenticated ? (
            <>
              <span className="text-sm font-medium">안녕하세요, {user?.name}님</span>
              <Button onClick={() => logout()} variant="outline" size="sm">로그아웃</Button>
            </>
          ) : (
            <Button onClick={openAuthModal} size="sm">로그인</Button>
          )}
        </div>
      </div>
    </>
  );
} 