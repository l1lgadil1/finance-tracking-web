'use client';

import { FC, useMemo, useState, useEffect } from 'react';
import { Locale } from '@/shared/lib/i18n';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { FiMenu } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
  locale: Locale;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children, locale }) => {
  const { user } = useAuth(locale);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Use Next.js's usePathname hook to detect route changes
  const currentPathname = usePathname();
  // Ensure pathname is never null
  const pathname = currentPathname || '';
  
  // Extract the part after the locale
  const pathWithoutLocale = useMemo(() => {
    const localePrefix = `/${locale}`;
    if (pathname && pathname.startsWith(localePrefix)) {
      // Get path after locale, defaulting to '/' if only locale is present
      const path = pathname.substring(localePrefix.length) || '/';
      // For dashboard homepage, map empty path to '/dashboard'
      return path === '/' ? '/dashboard' : path;
    }
    return pathname || '/dashboard';
  }, [pathname, locale]);
  
  // Get current page name for the header
  const pageName = useMemo(() => {
    const parts = pathWithoutLocale.split('/').filter(Boolean);
    const currentPage = parts[parts.length - 1] || 'dashboard';
    return currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
  }, [pathWithoutLocale]);

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);
  
  return (
    <div className="flex h-screen bg-background w-full" role="application">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true" 
        />
      )}
      
      {/* Sidebar navigation */}
      <div className={`fixed lg:static lg:flex-shrink-0 z-30 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <Sidebar locale={locale} activeHref={pathWithoutLocale} />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed header */}
        <Header 
          username={user?.email?.split('@')[0] || 'User'} 
          email={user?.email || 'Loading...'}
          pageName={pageName}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 mr-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <FiMenu className="h-5 w-5" />
          </button>
        </Header>
        
        {/* Scrollable content */}
        <main 
          className="flex-1 overflow-auto bg-background transition-colors duration-200 w-full"
          id="main-content"
          aria-label={`${pageName} section`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}; 