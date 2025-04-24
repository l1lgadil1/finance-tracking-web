import { motion } from 'framer-motion';
import { ThemeToggle } from '@/shared/ui/ThemeToggle';
import { LanguageSwitcher } from '@/shared/ui/LanguageSwitcher';
import { Locale, defaultLocale } from '@/shared/lib/i18n';
import { config } from '@/shared/config';

interface HeaderProps {
  locale: Locale;
  onChangeLocale: (locale: Locale) => void;
}

export const Header = ({ locale = defaultLocale, onChangeLocale }: HeaderProps) => {
  return (
    <div className="w-full max-w-5xl flex justify-between items-center mb-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold"
      >
        {config.app.name}
      </motion.h1>
      <div className="flex space-x-2">
        <ThemeToggle />
        <LanguageSwitcher 
          currentLocale={locale} 
          onChange={onChangeLocale}
        />
      </div>
    </div>
  );
}; 