'use client';

import { useParams } from 'next/navigation';
import { Locale } from '@/shared/lib/i18n';
import { TransactionsPage } from '@/pages/transactions';

export default function TransactionsPageRoute() {
  const params = useParams();
  const locale = (params?.locale as string || 'en') as Locale;
  
  return <TransactionsPage locale={locale} />;
} 