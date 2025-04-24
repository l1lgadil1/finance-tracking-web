'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/shared/model/store';
import { Header } from '@/widgets/Header';
import { TransactionChart } from '@/widgets/TransactionChart';
import { Locale, defaultLocale } from '@/shared/lib/i18n';

interface HomePageProps {
  params: {
    locale: Locale;
  };
}

export const HomePage = ({ params }: HomePageProps) => {
  const { locale, setLocale } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const currentLocale = locale || params?.locale || defaultLocale;

  // Set the locale from the URL parameter
  useEffect(() => {
    if (params?.locale) {
      setLocale(params.locale);
    }
  }, [params?.locale, setLocale]);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <Header 
        locale={currentLocale} 
        onChangeLocale={setLocale}
      />
      
      <TransactionChart />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Connect to the backend API at /api/...
      </p>
    </main>
  );
}; 