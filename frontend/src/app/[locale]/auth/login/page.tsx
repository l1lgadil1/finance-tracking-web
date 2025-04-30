'use client';

import { LoginForm } from '@/features/auth/login-form/login-form';
import React from 'react';
import { Locale } from '@/shared/lib/i18n';

interface LoginPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

export default function LoginPage({ params }: LoginPageProps) {
  const { locale } = React.use(params);
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900">
      <div className="w-full max-w-md">
        <LoginForm locale={locale} />
      </div>
    </div>
  );
} 