'use client';

import { useParams } from 'next/navigation';
import { Locale } from '@/shared/lib/i18n';
import { DashboardDataProvider } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';
import { AccountDetailPage } from '@/pages/account-detail';

export default function AccountPage() {
  const params = useParams<{ locale: string; id: string }>();
  const locale = (params?.locale as string || 'en') as Locale;
  const accountId = params?.id as string;
  
  return (
    <DashboardDataProvider locale={locale}>
      <AccountDetailPage params={{ locale, accountId }} />
    </DashboardDataProvider>
  );
} 