'use client';

import { LandingPage } from '@/pages/home';
import { Locale } from '@/lib/i18n';

interface LocalePageProps {
  params: {
    locale: string;
  };
}

export default function Home({ params }: LocalePageProps) {
  // Cast the locale string to the Locale type
  const typedParams = {
    locale: params?.locale as Locale
  };
  
  return <LandingPage params={typedParams} />;
}
