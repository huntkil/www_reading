'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loginSchema } from '@/lib/validation';

export type LoginCredentials = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => void;
  onSwitchToRegister: () => void;
  isLoading: boolean;
}

export function LoginForm({ onLogin, onSwitchToRegister, isLoading }: LoginFormProps) {
  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    onLogin(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          {...form.register('email')}
          required
          placeholder="hello@example.com"
        />
        {form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          {...form.register('password')}
          required
        />
        {form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
      </div>
      <div className="flex items-center justify-between">
         <div className="flex items-center space-x-2">
           <Checkbox id="remember-me" checked={form.watch('rememberMe')} onCheckedChange={(checked) => form.setValue('rememberMe', !!checked)} />
           <label
            htmlFor="remember-me"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            로그인 상태 유지
          </label>
         </div>
      </div>
      {form.formState.errors.root && <p className="text-sm text-red-500">{form.formState.errors.root.message}</p>}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        로그인
      </Button>
      <Button variant="link" onClick={onSwitchToRegister} className="w-full">
        계정이 없으신가요? 회원가입
      </Button>
    </form>
  );
} 