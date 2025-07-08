'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LoginForm, LoginCredentials } from './LoginForm';
import { RegisterForm, RegisterCredentials } from './RegisterForm';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, register } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (credentials: LoginCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(credentials);
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      await register(credentials);
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSwitchView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isLoginView ? '로그인' : '회원가입'}</DialogTitle>
          <DialogDescription>
            {isLoginView ? '서비스를 이용하시려면 로그인하세요.' : '환영합니다! 정보를 입력하여 계정을 만드세요.'}
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoginView ? (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={handleSwitchView}
            isLoading={isLoading}
          />
        ) : (
          <RegisterForm 
            onRegister={handleRegister}
            onSwitchToLogin={handleSwitchView}
            isLoading={isLoading}
          />
        )}
      </DialogContent>
    </Dialog>
  );
} 