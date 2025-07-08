'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';
import { AuthModal } from '@/components/Auth/AuthModal';

// 인증 상태 타입
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 컨텍스트에서 제공할 값들의 타입
interface AuthContextType extends Omit<AuthState, 'error'> {
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>;
  error: string | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

// 컨텍스트 생성 (초기값은 undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      if (data.success) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      }
    } catch (error) {
       setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  };

  useEffect(() => {
    checkSession();
  }, []);
  
  const login = async (credentials: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (data.success) {
      setAuthState({ user: data.user, isAuthenticated: true, isLoading: false, error: null });
      closeAuthModal();
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false, error: data.error }));
      throw new Error(data.error);
    }
  };

  const logout = async () => {
     setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthState({ user: null, isAuthenticated: false, isLoading: false, error: null });
  };
  
  const register = async (credentials: any) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
     if (data.success) {
      // 회원가입 성공 시 바로 로그인 처리
      await login({ email: credentials.email, password: credentials.password });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false, error: data.error }));
      throw new Error(data.error);
    }
  };

  const value = {
    ...authState,
    login,
    logout,
    register,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </AuthContext.Provider>
  );
};

// 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 