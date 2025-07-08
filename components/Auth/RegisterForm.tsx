'use client'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export type RegisterCredentials = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onRegister: (credentials: RegisterCredentials) => void;
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

export function RegisterForm({ onRegister, onSwitchToLogin, isLoading }: RegisterFormProps) {
  const form = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: RegisterCredentials) => {
    onRegister(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          type="text"
          {...form.register('name')}
          required
          placeholder="홍길동"
        />
        {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
      </div>
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
       <div className="space-y-2">
        <Label htmlFor="confirm-password">비밀번호 확인</Label>
        <Input
          id="confirm-password"
          type="password"
          {...form.register('confirmPassword')}
          required
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        회원가입
      </Button>
       <Button variant="link" onClick={onSwitchToLogin} className="w-full">
        이미 계정이 있으신가요? 로그인
      </Button>
    </form>
  );
} 