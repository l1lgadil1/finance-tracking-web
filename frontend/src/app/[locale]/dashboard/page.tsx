'use client';

import { useParams } from 'next/navigation';
import { Locale } from '@/shared/lib/i18n';
import { DashboardContainer } from '@/widgets/DashboardContainer';

export default function DashboardPage() {
  const params = useParams();
  const locale = params.locale as Locale;

  return (
    <DashboardContainer locale={locale} />
  );
} 