import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { locales, Locale, defaultLocale } from '@/shared/lib/i18n';

const languageNames = {
  en: {
    en: 'English',
    ru: 'Russian'
  },
  ru: {
    en: 'Английский',
    ru: 'Русский'
  }
};

type LanguageSwitcherProps = {
  currentLocale: Locale;
  onChange: (locale: Locale) => void;
};

export const LanguageSwitcher = ({ currentLocale, onChange }: LanguageSwitcherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const locale = currentLocale || defaultLocale;

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelect = (locale: Locale) => {
    onChange(locale);
    setIsOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md bg-gray-200 dark:bg-gray-800"
        aria-label="Change language"
      >
        {locale.toUpperCase()}
      </motion.button>

      {isOpen && (
        <div className="absolute top-full mt-1 right-0 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-300 dark:border-gray-700">
          {locales.map((localeOption) => (
            <button
              key={localeOption}
              onClick={() => handleSelect(localeOption)}
              className={`block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                localeOption === locale ? 'font-bold' : ''
              }`}
            >
              {languageNames[locale][localeOption]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 