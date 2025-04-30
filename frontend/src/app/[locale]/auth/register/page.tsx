'use client';

import { RegisterForm } from '@/features/auth/register-form/register-form';
import { Locale } from '@/lib/i18n';
import { useParams } from 'next/navigation';

export default function RegisterPage() {
  const params = useParams();
  const locale = params?.locale as Locale;

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900">
      <div className="w-full max-w-md">
        <RegisterForm locale={locale} />
      </div>
    </div>
  );
} 