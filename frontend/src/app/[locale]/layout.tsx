import { Locale } from "@/shared/lib/i18n";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  return children;
} 