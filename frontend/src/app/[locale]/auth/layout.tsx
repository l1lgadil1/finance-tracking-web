'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { LanguageSwitcher, ThemeToggle } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';
import { authApi } from '@/features/auth/auth-api';

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: Locale;
  }>;
}

// Translations
const translations = {
  en: {
    poweredBy: 'Powered by',
  },
  ru: {
    poweredBy: 'Работает на',
  },
};

export default function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = React.use(params);
  const t = translations[locale];
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is already authenticated
  useEffect(() => {
    const token = authApi.getToken();
    
    if (token) {
      // User is already logged in, redirect to dashboard
      router.push(`/${locale}/dashboard`);
    }
  }, [locale, router]);

  const handleLanguageChange = (newLocale: Locale) => {
    // Get the portion of the path after the locale
    const pathWithoutLocale = pathname?.substring(pathname.indexOf('/', 1) || pathname.length) || '';
    // Redirect to the same page with the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="min-h-screen flex flex-col w-full">
      {/* Header with language and theme switchers */}
      <header className="p-4 flex justify-end space-x-2">
        <LanguageSwitcher 
          currentLocale={locale} 
          onChange={handleLanguageChange} 
        />
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center">
        {children}
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center mb-2">
          <Link href={`/${locale}`} className="flex items-center">
            <span className="font-bold text-lg text-primary-500 mr-1">Aqsha</span>
            <span className="font-medium">Tracker</span>
          </Link>
        </div>
      </footer>
    </div>
  );
} 