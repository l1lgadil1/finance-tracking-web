'use client';

import { useParams } from 'next/navigation';
import { SettingsPage } from '@/pages/settings';
import { Locale } from '@/shared/lib/i18n';
import { DashboardDataProvider } from '@/widgets/DashboardContainer/providers/DashboardDataProvider';

export default function Page() {
    const params = useParams<{ locale: string }>();
    const locale = (params?.locale as string || 'en') as Locale;
    
    return (
        <DashboardDataProvider locale={locale}>
            <SettingsPage params={{ locale }} />
        </DashboardDataProvider>
    );
}
