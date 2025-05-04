'use client';

import { UIShowcasePage } from '@/pages/ui-showcase';
import { Locale } from '@/shared/lib/i18n';

export default function Page({ params }: { params: { locale: string } }) {
  return <UIShowcasePage params={{ locale: params.locale as Locale }} />;
} 