import { HomePage } from '@/pages/home';
import { Locale } from '@/shared/lib/i18n';

interface HomePageProps {
  params: {
    locale: Locale;
  };
}

export default function Home({ params }: HomePageProps) {
  return <HomePage params={params} />;
} 