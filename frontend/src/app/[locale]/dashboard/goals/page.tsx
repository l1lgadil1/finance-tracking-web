import { GoalsPage } from '@/pages/dashboard/goals';
import { Locale } from '@/shared/lib/i18n';

export default function Page({ params }: { params: { locale: Locale } }) {
  return <GoalsPage locale={params.locale} />;
} 