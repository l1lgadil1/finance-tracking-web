import { AnalyticsPage } from '@/pages/analytics';
import { Locale } from '@/shared/lib/i18n';
import { DashboardDataProvider } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';

interface PageProps {
  params: {
    locale: Locale;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <DashboardDataProvider locale={params.locale}>
      <AnalyticsPage params={params} />
    </DashboardDataProvider>
  );
} 