import { UIShowcasePage } from '@/pages/ui-showcase';
import { Locale } from '@/shared/lib/i18n';

interface UIShowcaseProps {
  params: {
    locale: Locale;
  };
}

export default function UIShowcase({ params }: UIShowcaseProps) {
  return <UIShowcasePage params={params} />;
} 