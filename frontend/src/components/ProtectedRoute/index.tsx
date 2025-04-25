'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/features/auth/auth-api';

interface ProtectedRouteProps {
  children: React.ReactNode;
  locale: string;
}

/**
 * A wrapper component that checks if the user is authenticated.
 * Redirects to the login page if the user is not authenticated.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, locale }) => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authApi.getToken();
      
      if (!token) {
        // User is not authenticated, redirect to login
        router.push(`/${locale}/auth/login`);
        return;
      }
      
      let isValid = false;
      
      try {
        // Verify the token by making a request to the profile endpoint
        await authApi.getProfile();
        // Token is valid
        isValid = true;
      } finally {
        if (isValid) {
          setIsChecking(false);
        } else {
          // Token is invalid, remove it and redirect to login
          authApi.removeToken();
          router.push(`/${locale}/auth/login`);
        }
      }
    };

    checkAuth();
  }, [locale, router]);

  if (isChecking) {
    // You could add a loading spinner here
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}; 