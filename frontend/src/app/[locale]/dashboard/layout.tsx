'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Locale } from '@/shared/lib/i18n';
import { DashboardLayout } from '@/widgets/DashboardLayout';

export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = (params?.locale as string || 'en') as Locale;
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth(locale);

  // Redirect to login if not authenticated and finished loading
  useEffect(() => {
    // Only redirect if we've finished checking auth state and user is not authenticated
    if (!isLoading && isAuthenticated === false) {
      router.push(`/${locale}/auth/login`);
    }
  }, [isLoading, isAuthenticated, router, locale]);

  // Show loading screen if checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Only show the dashboard content if authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout locale={locale}>
      {children}
    </DashboardLayout>
  );
} 