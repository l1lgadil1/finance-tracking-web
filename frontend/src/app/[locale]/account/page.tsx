'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AccountPageRedirect() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale || 'en';
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${locale}/dashboard/accounts`);
  }, [locale, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-16 h-16 border-t-4 border-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to accounts page...</p>
      </div>
    </div>
  );
} 