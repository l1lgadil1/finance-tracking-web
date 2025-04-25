'use client';

import React from 'react';
import { ProtectedRoute } from '@/components';
import { Locale } from '@/shared/lib/i18n';
import { Header, Sidebar } from '@/widgets/DashboardLayout';
import { useAuth } from '@/hooks';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export default function DashboardLayout({ children, params: { locale } }: DashboardLayoutProps) {
  const { user } = useAuth(locale);
  
  // Get the current path
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  // Extract the part after the locale
  const pathWithoutLocale = pathname.substring(pathname.indexOf('/', 1) || pathname.length);
  const currentPage = pathWithoutLocale.replace('/', '') || 'dashboard';
  const pageTitle = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
  
  return (
    <ProtectedRoute locale={locale}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar navigation */}
        <Sidebar locale={locale} activeHref={pathWithoutLocale} />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Fixed header */}
          <Header 
            username={user?.email?.split('@')[0] || 'User'} 
            email={user?.email || 'Loading...'}
            pageName={pageTitle}
          />
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800">
            {children}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 