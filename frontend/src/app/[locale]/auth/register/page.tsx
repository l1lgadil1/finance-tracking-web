'use client';

import { RegisterForm } from '@/features/auth/register-form/register-form';

export default function RegisterPage({ params: { locale } }: { params: { locale: 'en' | 'ru' } }) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900">
      <div className="w-full max-w-md">
        <RegisterForm locale={locale} />
      </div>
    </div>
  );
} 