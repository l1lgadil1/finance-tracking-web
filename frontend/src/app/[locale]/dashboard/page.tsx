'use client';

import { useParams } from 'next/navigation';
import { Locale } from '@/shared/lib/i18n';
import { DashboardContainer } from '@/widgets/DashboardContainer';
import { ActionButtons } from '@/widgets/action-buttons/ui/ActionButtons';

export default function DashboardPage() {
  const params = useParams();
  const locale = (params?.locale as string || 'en') as Locale;

  return (
    <>
      <DashboardContainer locale={locale} />
      <ActionButtons />
    </>
  );
} 